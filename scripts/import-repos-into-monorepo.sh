#!/bin/bash

# Input checks and help/usage
#############################

IMPORT_REPO_URL="$1"
MONOREPO_URL="$2"
IMPORT_TO_FOLDER="$3"

print_usage() {
    echo
    echo "  Import a repo into your monorepo."
    echo
    echo "  Usage:"
    echo
    echo "      $0 <REPO_URL> <MONOREPO_URL> <FOLDER>"
    echo
    echo "  Example usage:"
    echo
    echo "      $0 \\
                    https://github.com/marcuswestin/store.js.git \\
                    https://github.com/my_account/my_monorepo \\
                    js/imports/store"
    echo
}

if [[ ( $@ == "--help") ||  $@ == "-h" ]]; then
    print_usage
    exit 0
fi

if [[ ${MONOREPO_URL} == "" || ${IMPORT_REPO_URL} == '' || ${IMPORT_TO_FOLDER} == '' ]]; then
    print_usage
    echo
    echo "  Error: missing arguments!"
    echo
    exit -1
fi

# Step 0: Setup
###############

IMPORT_REPO_FOLDER=$(basename -- "${IMPORT_REPO_URL}")
IMPORT_REPO_NAME="${IMPORT_REPO_FOLDER%.*}"

MONOREPO_BASENAME=$(basename -- "${MONOREPO_URL}")
MONOREPO_NAME="${MONOREPO_BASENAME%.*}"
MONOREPO_EXTENSION="${MONOREPO_BASENAME##*.}"
MONOREPO_FOLDER="${MONOREPO_NAME}-monorepo-import.${MONOREPO_EXTENSION}"

git clone ${MONOREPO_URL} ${MONOREPO_BASENAME} || echo "already cloned"
cd ${MONOREPO_BASENAME}

# Uncomment this to start from scratch
# rm -rf "${MONOREPO_FOLDER}"


# Phase 1: Fetch remote for repo to import
##########################################

# Exit immediately if a command exits with a non-zero status,
# and print commands and their arguments as they are executed.
set -ex

git remote add "${IMPORT_REPO_NAME}" "${IMPORT_REPO_URL}" || echo "Remote already exists"
git fetch "${IMPORT_REPO_NAME}"



# Phase 2: Import repo into a seperate branch and rewrite its
# commit history to fit in with the monorepo folder structure.
##############################################################

git checkout -f -b "${IMPORT_REPO_NAME}_master" "${IMPORT_REPO_NAME}/master"
# Rewrite history to move all IMPORT_REPO_NAME files into a subdirectory
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --index-filter '\
    git ls-files -s | sed "s#\t#&'"${IMPORT_TO_FOLDER}"'/#g" \
        | GIT_INDEX_FILE=${GIT_INDEX_FILE}.new git update-index --index-info && \
            if [ -f "${GIT_INDEX_FILE}.new" ]; then \
                mv "${GIT_INDEX_FILE}.new" "${GIT_INDEX_FILE}"; \
            fi' --


# Phase 3: Merge repo and its rewritten history into the monorepo
#################################################################

git checkout master

git merge --no-commit --allow-unrelated-histories "${IMPORT_REPO_NAME}_master"

git commit -a -m "Import ${IMPORT_REPO_URL} to ${IMPORT_TO_FOLDER}" || echo "Nothing to do"

git branch -D "${IMPORT_REPO_NAME}_master"
git remote remove "${IMPORT_REPO_NAME}"


# Phase 4: Prune all history and do an aggressive gc
####################################################

git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Print instructions for how to push changes to the monorepo.
#############################################################
set +x

CWD=`pwd`
echo
echo "  Done!"
echo
echo "  ${IMPORT_REPO_URL} was imported to ${MONOREPO_BASENAME}/${IMPORT_TO_FOLDER}."
echo
echo "  Finish up by pushing the new repo:"
echo
echo "      cd ${CWD}"
echo "      git push origin master"
echo