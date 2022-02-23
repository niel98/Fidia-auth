const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        name: String
        email: String
        mobile_number: String
        country: String
        password: String
        isVerified: Boolean
    }

    # type AuthValidateResponse {

    # }

    type AuthPayload {
        token: String!,
        user: User!
    }

    type ResetTokenPayload {
        token: String!,
        user: User!
    }

    #Queries
    type Query {
            getUsers: [User!]!
        }

    #Mutations
    type Mutation {
        signUp(
            name: String!, 
            email: String!, 
            password: String!, 
            mobile_number: String!, 
            country: String!
            ): User!

        signIn(
            email: String!,
            password: String!
        ): AuthPayload!

        resendVerificationLink(
            email: String!
        ): User!

        verifyAccount: User!
    }

`

module.exports = { typeDefs };