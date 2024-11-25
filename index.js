// index.js

import http from 'http-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8080;

const server = http.createServer({ root: path.join(__dirname, 'public') });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
