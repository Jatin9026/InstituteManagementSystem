const http = require('http');
const port=3000; 
const app= require("./app");
require("dotenv").config();
console.log(process.env.SECRET_KEY)
const server=http.createServer(app);
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})