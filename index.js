const express = require('express');
const colors = require('colors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/TypeDefs');
const { resolvers } = require('./schema/Resolvers');

const connectDB = require('./utils/db');
require('dotenv').config();

const main = async () => {

    const app = express();

    // const httpServer = http.createServer(app);

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers
        }
    );
        // console.log({ server })
    await server.start();
    server.applyMiddleware({ app });
    // await new Promise(resolve => httpServer.listen({port: 8000}, resolve));

    connectDB();

    const PORT = process.env.PORT || 8000;

    app.get('/', (_, res) => {
        res.send('Hello from Fidia server');
    });

    app.get('/verify/:email/:token', resolvers.Mutation.verifyAccount);

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`.italic.blue);
    });
}

main().catch(err => {
    console.log(err.message);
});