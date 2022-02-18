const express = require('express');
const colors = require('colors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/TypeDefs');
const { resolvers } = require('./schema/Resolvers');

const connectDB = require('./utils/db');
require('dotenv').config();

const main = async () => {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();
    server.applyMiddleware({ app });

    connectDB();

    const PORT = process.env.PORT || 8000;

    app.get('/', (_, res) => {
        res.send('Hello from Fidia server');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`.italic.blue);
    });
}

main().catch(err => {
    console.log(err.message);
});