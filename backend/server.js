const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase=require("./config/database");
//config

//handling uncaught exception
process.on("uncaughtException",err=>{
    console.log(`Error + ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
    
})


dotenv.config({path:"backend/config/config.env"});
//connectdatabase
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error + ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})