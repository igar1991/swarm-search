# Uploader

Uploader is required to upload the finished database to Ethereum Swarm. The entire database is split into pieces and
uploaded to Swarm. 

As a result of the utility, it produces a Swarm reference referring to a JSON file with an array of
all blocks.

Each block has a `sha256` field for additional control over the integrity of each section of the file.

Example of such JSON file.

```json
{
  "v": 1,
  "dbVersion": 1,
  "title": "English Wiki Titles",
  "description": "English Wiki Titles",
  "blocks": [
    {
      "id": 0,
      "size": 10000000,
      "swarmReference": "d3a20e5a12f71f98925201159c8a7ebd53a711a83905808ea0a33c09c7f0b4a5",
      "sha256": "7b660bf8c6e2ab533e7f53269ebe45c1ede6d1a5abd27d68cdb2b1f36f1273b4"
    },
    {
      "id": 1,
      "size": 10000000,
      "swarmReference": "8b58cbf13cdcba9692dc275ac5e1d5a6a42a2f14bb343e24cdd76e0d40909416",
      "sha256": "2ccd2c945158d68b83dd27563c7192a6f26870350627a3cb279ffd3f3df4e46b"
    },
    {
      "id": 2,
      "size": 10000000,
      "swarmReference": "52846bbbac7b74e6a300fc4a5fb79cd0c386582022b781409a1fe6cfeae12698",
      "sha256": "1b2db0e0e8d1ee7cba6f77023a3dba2343dbb4b9a089719db35a623c7d142aa5"
    },
    {
      "id": 3,
      "size": 10000000,
      "swarmReference": "5637b686401c1a5bdd8cfd6a9ea7d2c4299fc228ff6de32f47f0e8e9658cf2bc",
      "sha256": "5df5e8d01ef10497f35edc544978b47901d8d023dd22c26ad902cc1b631f41b6"
    },
    {
      "id": 4,
      "size": 10000000,
      "swarmReference": "5ba2f0815a20f0b9356efdc889bf5b03793af55c061faace1962136570c27bf8",
      "sha256": "019ebeb0a826dedafa005d7e3ed108a0c400fb392b3a0141160b55dfef57fda4"
    },
    {
      "id": 5,
      "size": 10000000,
      "swarmReference": "83eae0c1bd05b730a0a335dc5c70e166c8d0924a809d8a0ae1f045e671a3ba0c",
      "sha256": "1deb56fe8ea8a410fd3c46f92cdf0f441dc8437dec5647eb1254c6867af69d51"
    }
  ]
}
```

## Environment variables

`UPLOADER_BEE_URL` - Bee API URL for data uploading. It can be your local machine or a gateway. Default value is `http://localhost:1633`

`UPLOADER_BEE_STAMP` - stamp for uploading via Bee API URL

`UPLOADER_DB_NAME` - title in the metadata

`UPLOADER_DB_DESCRIPTION` - description in the metadata

`UPLOADER_DB_FILE_PATH` - file path that should be uploaded to the network

`UPLOADER_SPLIT_BLOCK_SIZE` - how many bytes to split the file into. Default value is `1000000`

`UPLOADER_START_UPLOAD_BLOCK` - from which block start to upload. If the value is not equal to the `1`, it means that final metadata will be incorrect. This parameter needed for reuploading specific blocks. Default value is `1`


These variables should be put to `.env` file.

## Run

`npm run start-uploader`
