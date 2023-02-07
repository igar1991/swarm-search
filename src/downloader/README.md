# Downloader

Downloader is an internal web server that accepts requests to download databases from Ethereum Swarm.

The database consists of meta-information about the database and about each of its parts.

The whole database is divided into pieces and a sha256 hash is created for each piece.

This approach allows you:
* Control the integrity of the database during the download
* Store tens and hundreds of GB of databases in Swarm

## API

### Download a DB

POST `/v1/download`

Post data: id=DB_ID

### Check status of the DB

GET `/v1/status?id=DB_ID`

## Environment variables

`SWARM_DOWNLOADER_BEE_URL` - Bee API url, for example `http://localhost:1633`

`SWARM_DOWNLOADER_OUTPUT_PATH` - path where all downloads databases will be stored

`SWARM_DOWNLOADER_SLEEP_TIME` - queue checking delay, default 1000 ms 

`SWARM_DOWNLOADER_PORT` - port where downloader API will be available, default 7891

These variables should be put to `.env` file.

## Run

`npm run start-downloader`