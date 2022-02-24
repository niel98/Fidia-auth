const { chai, expect } = require('chai');
const { describe, it } = require('mocha');
const EasyGraphQLTester = require('easygraphql-tester');
const User = require('../models/User');
const { typeDefs } = require('../schema/TypeDefs');
const { resolvers } = require('../schema/Resolvers');

let tester;

beforeEach(() => {
    tester = new EasyGraphQLTester(typeDefs, resolvers);
})


describe('User Tests', () => {
    // Test signUp mutation works (Creates a user)
    it ('signUp mutation adds new user to Database', async () => {
        const mutation = `
                mutation signUp(
                    name: String!, 
                    email: String!, 
                    password: String!, 
                    mobile_number: String!, 
                    country: String!
                ) {
                    name
                    email
                    country
                }`
            const userCount = User.length;
            tester.graphql(true, mutation, { input: {
                name: 'Daniel Moses',
                email: 'mosesdaniel@yahoo.com',
                password: '1234567890',
                mobile_number: '2653876453',
                country: 'Nigeria'
            }}).then(result => {
                expect(User.length).to.be.eq(userCount)
            })
            .catch(err => console.log(err))
    })

    //Test Login mutation (Doesn't allow unverified users to login)
    // it ('login mutation does not allow unverified users log in', () => {
    //     const mutation = `
    //             mutation signIn(
    //                 email: String!,
    //                 password: String!
    //             ) {
    //                 token
    //                 user
    //             }`
    //         const user = 
    // })

    //Test Get users query that it fetches all users from the db.
    it ('Query for fetching all users works as expected', () => {
        const validQuery = `
        {
            getUsers {
                name
            }
        }`

        tester.test(true, validQuery, {
            user: User
        })
    })
})

