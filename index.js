// index.js
import httpServer from 'http-server';

const server = httpServer.createServer({ root: './' });

const port = 8080;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
