const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        name: String!
        email: String!
        mobile_number: Int!
        country: String!
        password: String!
        isVerified: Boolean!
    }

    #Queries
    type Query {
            getUsers: [User!]!
        }

    #Mutations
    type Mutation {
        signUp(name: String!, email: String!, password: String!, mobile_number: Int!, country: String!): User!
    }

`

module.exports = { typeDefs };