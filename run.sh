docker rm -f foaashk
docker run --name foaashk -d -e VIRTUAL_HOST=foaashk.com -p 5001:5001 -v "$PWD":/app -w /app node:roy node .

    Contact GitHub API Training Shop Blog About 

    © 2017 GitHub, Inc. Terms Privacy 
