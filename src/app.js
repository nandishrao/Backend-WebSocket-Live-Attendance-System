const express =  require("express")
import apiRoutes from './routes/index.js';

const app = express()
const PORT = 3000;

const http = require("http");

const server = http.createServer(app);
server.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}🚀🚀🚀`)
});

app.use('/api', apiRoutes)