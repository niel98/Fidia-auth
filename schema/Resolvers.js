const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const argon2 = require('argon2');
const sendMail = require('../utils/sendmail');
const { UserInputError } = require('apollo-server-express');

const resolvers = {
    Query: {
        getUsers: async () => {
            const users = await User.find();
            console.log('Users: ', users);
            return users;
        }
    },

    Mutation: {
        signUp: async (_, args) => {

            const { name, email, password, mobile_number, country } = args;
            //Check if the user exists on the Database
            let user = await User.findOne({ email: email });
            console.log('user exists? ', user);
            let phone = await User.findOne({ mobile_number: mobile_number});
            console.log('phone exists? ', phone);

            if (user) {
                throw new UserInputError('User with the email already exists!');
            }
            if (phone) {
                throw new UserInputError('User with the phone number already exists!');
            }

            const hashedPassword = await argon2.hash(password);
            user = await new User({ 
                name, 
                email, 
                mobile_number, 
                password: hashedPassword, 
                country, 
            });
            await user.save();
            
            let token = await Token.findOne({ userId: user._id});
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save();
            }

            const message = `Welcome to Fidia, verify your account by clicking on the url ${process.env.BASE_URL}/${token.token}`;
            await sendMail(email, 'Account Verification', message);

            return user;
        },

        signIn: async (_, args) => {

            const { email, password } = args;
            //Check if the user exist on the database
            const user = await User.findOne({ email: email});

            if (!user) {
                throw new UserInputError('Invalid User');
            }

            //Validate password
            const validPassword = await argon2.verify(user.password, password);

            if (!validPassword) {
                throw new UserInputError('Invalid login credentials');
            }

            //Check if the user has verified account
            if (!user.isVerified) {
                throw new UserInputError('Account not verified!');
            }

            //Generate token
            const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

            return {
                token,
                user: user
            }
        }
    }
}

module.exports = { resolvers };