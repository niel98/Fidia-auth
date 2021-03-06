const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendmail');

const resolvers = {
    Query: {
        getUsers: async () => {
            const users = await User.find();
            return users;
        },
    },

    Mutation: {
        signUp: async (_, args) => {

            const { name, email, password, mobile_number, country } = args;
            //Check if the user exists on the Database
            let user = await User.findOne({ email: email });
            let phone = await User.findOne({ mobile_number: mobile_number});

            if (user) {
                throw new Error('User with the email already exists!');
            }
            if (phone) {
                throw new Error('User with the phone number already exists!');
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
                    token: crypto.randomBytes(16).toString('hex')
                }).save();
            }

            // const message = `Welcome to Fidia, verify your account by clicking on the url ${process.env.BASE_URL}/${email}/${token.token}`;
            const html = `<p>Welcome to Fidia, verify your account by clicking on the button</p> <a href="${process.env.BASE_URL}/${email}/${token.token}"><button>Verify Email</button></a>`;
            await sendMail(email, 'Account Verification', html);

            return user;
        },

        signIn: async (_, args) => {

            const { email, password } = args;
            //Check if the user exist on the database
            const user = await User.findOne({ email: email});

            if (!user) {
                throw new Error('Invalid User');
            }

            //Validate password
            const validPassword = await argon2.verify(user.password, password);

            if (!validPassword) {
                throw new Error('Invalid login credentials');
            }

            //Check if the user has verified account
            if (!user.isVerified) {
                throw new Error('Account not verified!');
            }

            //Generate token
            const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

            return {
                token,
                user: user
            }
        },

        resendVerificationLink: async (_, args) => {
            const { email } = args;
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            if (user.isVerified) {
                throw new Error('User is already verified, proceed to sign in');
            }

            let token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save()

            const html = `<p>Welcome to Fidia, verify your account by clicking on the button</p> <a href="${process.env.BASE_URL}/${email}/${token.token}"><button>Verify Email</button></a>`;
            await sendMail(email, 'Account Verification', html);

            return user;
        }
    }
}

module.exports = { resolvers };