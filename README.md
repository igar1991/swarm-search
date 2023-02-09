# Swarm Search

Swarm Search is a mechanism for instant search in an array of decentralized data.

The solution is Layer-2 working on top of Ethereum Swarm. With it, you can create a SQLite database, share it and use it.

The database can be used, for example, for instant suggestions for available pages on decentralized projects like [BzzWiki](https://github.com/igar1991/swarm-wiki) or your own project.

[![Suggestions DEMO"](https://i.ytimg.com/vi/tpktKqwaN3w/maxresdefault.jpg)](https://www.youtube.com/watch?v=tpktKqwaN3w)

## Backend components

The backend for the databases can be a gateway or your local machine. To run the database locally, configure and run `downloader` and `server`. and specify your address as API url. 

**Remember** that on pages running under https, you need to specify the API url with https.

## Front-end library

Library for accessing the server API from a client side.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/client/README.md)

## Server

The server is designed to process requests from end users.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/server/README.md)

## Downloader

Downloader is an internal web server that accepts requests to download databases from Ethereum Swarm.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/downloader/README.md)

## Indexer

Indexer is needed to create a SQLite database from a data.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/indexer/README.md)

## Uploader

Uploader is required to upload the finished database to Ethereum Swarm.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/uploader/README.md)

## Deployer

Deployer is designed to send a request to the gateway to download the database with tracking when the database is downloaded.

[README.md](https://github.com/igar1991/swarm-search/tree/master/src/deployer/README.md)

## How to create and start a decentralized DB?

0) Copy `example.env` to `.env`. Fill in the required fields 
1) Get the list of titles of your content
2) Run `indexer` for creating a SQLite DB from the titles
3) Run `uploader` for uploading SQLite DB to Ethereum Swarm. Get DB ID from the output
4) Configure your `server` with the DB ID. Start `server`
5) Start `downloader`
6) Run `deployer` and wait syncing the DB data
7) Start using front-end library to make queries to the DB

If you want to run `server` and `downloader` as daemons, you can use `pm2`:

`npm install pm2 -g`

`pm2 start "cd /root/swarm-search && npm run start-downloader"`

`pm2 start "cd /root/swarm-search && npm run start-server"`

## Testing

```
npm run test
```

## Ideas

### Full-text search

The project has the ability to use requests other than suggestion. For example, it is possible to implement full-text search in a project. To do this, for example, use elasticsearch bulk insert format data from https://dumps.wikimedia.org/other/
