const server = require('./api/server.js');

const port = 9001;

server.listen(port, () => {
    console.log(`Hello, this is God. This server may exist on port ${port}`)
});

