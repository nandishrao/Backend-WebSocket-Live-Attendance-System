const express =  require("express")

const app = express()
const PORT = 3000;

const http = require("http");

const server = http.createServer(app);
server.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}🚀🚀🚀`)
});

app.use('/api', apiRoutes)