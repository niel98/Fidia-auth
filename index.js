const express = require('express');
const colors = require('colors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/TypeDefs');
const { resolvers } = require('./schema/Resolvers');
const Token = require('./models/Token');
const User = require('./models/User');

const path = require('path');

const connectDB = require('./utils/db');
require('dotenv').config();

const main = async () => {

    const app = express();

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: ({ req, res }) => {
            return {
                req,
                res
            }
        }
        }
    );

    await server.start();
    server.applyMiddleware({ app });

    connectDB();

    const PORT = process.env.PORT || 8000;

    app.get('/', (_, res) => {
        res.send('Hello from Fidia server');
    });

    app.get('/verify/:email/:token', async (req, res) => {
        console.log('Params: ', req.params);
        const email = req.params.email;
        let authToken = req.params.token;
            if (!authToken) {
                return res.sendFile(path.join(__dirname, '/utils/verification-success.html'));
            }
            console.log('Auth-token: ', authToken);
            let token = await Token.findOne({ token: authToken}); //req.params.token
            if (!token) {
                return res.sendFile(path.join(__dirname, '/utils/link-expired.html'));
            }
             // //If token is found, check for a valid user
             let user = await User.findOne({ email: email }); //req.params.email
             if (!user) {
                return res.sendFile(path.join(__dirname, '/utils/user-invalid.html'));
             }
             if (user.isVerified) {
                // throw new Error('User is already verified, proceed to sign in.');
                return res.sendFile(path.join(__dirname, '/utils/user-is-verified.html'));
            }

             // //Verify user
             user.isVerified = true;
             await user.save();
 
             return res.sendFile(path.join(__dirname, '/utils/verification-success.html'));
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}${server.graphqlPath}`.italic.blue);
    });
}

main().catch(err => {
    console.log(err.message);
});