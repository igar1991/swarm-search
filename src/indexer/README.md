# Indexer

Indexer is needed to create a SQLite database from a data. For example from the list of article titles.

## Where can I get an example titles list?

Go to https://dumps.wikimedia.org/other/pagetitles/

Download titles archive that you needed

Unpack it `gunzip DOWNLOADED_FILE.gz -c > titles.txt`

Titles file contains list of all titles preceded by `page_title` header.

```
page_title
Albatros
Bubble
Cat
Dog
...
```

## Environment variables

`INDEXER_SEARCH_TYPE` - `wiki_titles` for indexing a file with titles or `files` for indexing files

`INDEXER_SEARCH_PATH` - path with files for indexing (for search type `files`)

`INDEXER_LINES_FILE_PATH` - path file with lines (for search type `wiki_titles`)

`INDEXER_OUTPUT_PATH` - output file path for the final DB

`INDEXER_OVERRIDE_DB` - `'true'` for override DB

`INDEXER_START_POSITION` - start position for indexing, `0` as default

`INDEXER_MUTE_PROCESS_LOGS` - `'true'` for muting logs

These variables should be put to `.env` file.

## Run

`npm run start-indexer`
