# Server

The server is designed to process requests from end users.

## API

GET `/v1/info` - get info about the server state

POST `/v1/index/use` - ask the server to download the DB
data: id=46ed7c05f2cb5baf90f3bea9aa0a30a71148121af3470c249853d630329bd769

GET `/v1/index/status?id=DB_ID` - get status of the DB

GET `/v1/suggest?id=DB_ID&q=hello` - return suggests by the request to the specific DB

## Environment variables

`SWARM_SEARCH_TYPES` - allowed search types. `a` for autocomplete. Other options can be available later

`SWARM_SEARCH_MAIN_PORT` - port where the server will be available. `7890` by default

`SWARM_SEARCH_DBS_PATH` - directory path where all databases will be located

`SWARM_SEARCH_DOWNLOADER_SERVER_URL` - downloader API URL, for example `http://localhost:7891`

`SWARM_SEARCH_DOWNLOAD_ALLOWANCE_TYPE` - mode of server for downloading databases. `any` for any DB - not recommended for public server. `allowed_list` - allow to download only specified list of databases. 

`SWARM_SEARCH_ALLOWED_DBS` - list of allowed database identifiers with `,` like delimiter

These variables should be put to `.env` file.

## Run

`npm run start-server`
