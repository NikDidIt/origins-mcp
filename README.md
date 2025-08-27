# Origins-MCP
Collection of stuff around my house that I can pull information from. 

## Requirments
Latest version of Node.js and NPM.

## Install
1. Download source
2. Run ````npm install````

## Setup
There is a ***connection*** directory in the plugins folder. These connections have their own .env file you will need to configure. Remove the .example from the end and configure the related items.

## Running
To run use ````npm run start````

## Tests
To use run ````npm run test````

## MCP Inspector
To use run ````npm run inspect````

## Use in LM Studio
Edit your mcp.json file and add

    "origin-api": {
      "url": "http://localhost:3636/origin-mcp"
    }
