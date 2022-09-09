const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const connection = async() => {
    try {
        const dbConnection = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ouk1vo3.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log("Está connectado ao banco de dados.")

        return dbConnection;
    } catch (error) {
        console.log(error);
    }
}

connection();

module.exports = connection;