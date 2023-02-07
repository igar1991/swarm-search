# Front-end library

Library for accessing the server API from a client side.

Installation

```
npm i @bzzwiki/wiki-search
```

Using

```js
import {SearchClient} from '@bzzwiki/wiki-search';

const searchClient = new SearchClient('http://localhost:7890/v1');
```


# Integration with a UI

Example of integration with a UI: https://github.com/igar1991/swarm-wiki/tree/master/frontend/wiki/src/Suggest

# Methods

```js
// API url of the server (local or remote)
const serverURL = 'http://localhost:7890/v1'
const client = new SearchClient(serverURL)
// id of the database
const id = `46ed7c05f2cb5baf90f3bea9aa0a30a71148121af3470c249853d630329bd769`
```

```js
// get server info
const data = await client.getServerInfo()
```

```js
// get status of the DB (available or not for queries)
const status = await client.getIndexStatus(id)
```

```js
// ask server to download the db if not downloaded
const useInfo = await client.useIndex(id)
```

```js
// ask to return results with suggestions from the db
const result = await client.suggest(id, 'hello')
```