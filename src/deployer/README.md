# Deployer

Deployer is designed to send a request to the gateway to download the database with tracking when the database is downloaded.

## Environment variables

`SWARM_DEPLOYER_DB_ID` - DB ID that should be downloaded. For example: `46ed7c05f2cb5baf90f3bea9aa0a30a71148121af3470c249853d630329bd769`

`SWARM_DEPLOYER_SERVER_URL` - server API URL

These variables should be put to `.env` file.

## Run

`npm run start-deployer`