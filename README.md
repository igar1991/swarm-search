# Swarm Search

Swarm Search is a mechanism for instant search in an array of decentralized data.

-Can be used with gateways/locally

## Front-end library

## Indexer

## Uploader

## Downloader

Downloader is an internal web server that accepts requests to download databases from Swarm. 

The database consists of meta-information about the database and about each of its parts. 

The whole database is divided into pieces and a sha256 hash is created for each piece. 

This approach allows you:
* Control the integrity of the database during the download
* Store tens and hundreds of GB of databases in Swarm

## ---Suggestions

Create SQLite DB for titles only using `src/indexer/README.md` instruction.

## Testing

```
npm run test
```

## Ideas

### Full-text search

The project has the ability to use requests other than suggestion. For example, it is possible to implement full-text search in a project. To do this, for example, use elasticsearch bulk insert format data from https://dumps.wikimedia.org/other/

### Proof of DB author

To confirm each new version of the database, it may be necessary to be able to verify the author of the database. A field with the address of the author and his signature can be embedded in the database metadata.
