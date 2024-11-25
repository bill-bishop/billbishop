// index.js

import http from 'http-server';

const port = process.env.PORT || 8080;

const server = http.createServer({ root: '.' });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
