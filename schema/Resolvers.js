const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');

const resolvers = {
    Query: {
        getUsers: async () => {
            await User.find();
        }
    },

    Mutation: {
        signUp: async (parent, args) => {

            const newUser = args;
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
            // user = await new User({ name, email, mobile_number, hashedPassword, country });
            user = await new User(newUser);
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
    }
}

module.exports = { resolvers };