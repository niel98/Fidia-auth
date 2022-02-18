const User = require('../models/User');
const Token = require('../models/Token');
const argon2 = require('argon2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const sendMail = require('../utils/sendmail');

module.exports = {
    Query: {
        getUsers: async () => {
            await User.find();
        }
    },

    Mutation: {
        signUp: async (_, { name, email, mobile_number, password, country }) => {
            //Check if the user exists on the Database
            const user = await User.findOne({ email: email });
            const phone = await User.findOne({ mobile_number: mobile_number});

            if (user) {
                return 'User with the email already exists';
            }
            if (phone) {
                return 'User with the mobile number already exists';
            }

            const hashedPassword = await argon2.hash(password);
            user = await new User({ name, email, mobile_number, hashedPassword, country });
            await user.save();
            
            const token = await Token.findOne({ userId: user._id});
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save();
            }

            const message = `Welcome to Fidia, verify your account by clicking on the url ${process.env.BASE_URL}/${token}`
            await sendMail(email, 'Account Verification', message);

            return 'New user account created, Check your email to verify your account';
        },

        login: async (_, { email, password }) => {
            //Check if the user exist on the database
            const user = await User.findOne({ email: email});

            if (!user) {
                return 'User with the email does not exist';
            }

            //Validate password
            const validPassword = await argon2.verify(user.password, password);

            if (!validPassword) {
                return 'Invalid username or password';
            }

            //Generate token
            const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

            return {
                message: 'User login successful',
                user: user,
                token
            }
        }
    }
}