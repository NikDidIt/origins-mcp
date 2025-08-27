/*

Create MCP Server and tie tools to it

*/
process.loadEnvFile('.env');

import express from 'express';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { dynamicTools } from './sysgen_tools.js'


const app = express();
app.use(express.json());

function getServer() {
    const server = new McpServer({
        name: "origins-mcp",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });

    //loop through tools and add them to the server
    for (const tool in dynamicTools) {
        if (dynamicTools.hasOwnProperty(tool)) {
            const t = dynamicTools[tool];
            if (t.shouldInclude()) {
                server.tool(t.getName(), t.getDescription(), t.getParams(), t.getFunction());
            }
        }
    }

    return server;
}

//From example code online
app.post('/origins-mcp', async (req, res) => {
    try {
        const server = getServer(); 
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        res.on('close', () => {
            console.log('Request closed');
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

// SSE notifications not supported in stateless mode
app.get('/origins-mcp', async (req, res) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

// Session termination not needed in stateless mode
app.delete('/origins-mcp', async (req, res) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

// Start the server
const PORT = process.env.PORT || 3636;

app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});