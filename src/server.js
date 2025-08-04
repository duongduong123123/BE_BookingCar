require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);




connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
