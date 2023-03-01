# Install rjson package, if needed
if(!require(rjson)) install.packages("rjson",repos = "http://cran.us.r-project.org")
# load rjson package
library(rjson)
# obtain the command line arguments for host and port
args <- commandArgs(trailingOnly = TRUE)
url <- paste("http://",args[1],":",args[2], "/bestbooks/v2/version",sep="")
# invoke a JSON HTTP request
document <- fromJSON(file=url, method='C')
# convert the return JSON to a data frame
json_data_frame <- as.data.frame(document)
# obtain the version
version <- json_data_frame['version']
# output the version to stdout
print(version)