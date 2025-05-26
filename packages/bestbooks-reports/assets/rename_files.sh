#!/bin/bash

# Loop through all files matching the pattern "test_something.js"
for file in test_*.js; do
    # Extract the "something" part from the filename
    new_name=$(echo "$file" | sed 's/^test_\(.*\)\.js$/\1.test.js/')
    
    # Rename the file
    mv "$file" "$new_name"
done
