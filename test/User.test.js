const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:8000/`;
const request = require('supertest')(url);

// let args;

// beforeEach(() => {
//     const { name, email, mobile_number, password, country } = args
// })

describe('User Tests', () => {
    // Test signUp mutation works (Creates a user)
    // it ('signs up a user', async () => {
    //     assert.ok();
    // })

    //Test Login mutation (Doesn't allow unverified users to login)

    //Test Get users query that it fetches all users from the db.
    it ('returns all Users', (done) => {
        request(app).post('/graphql')
        .send({ query: '{ getUsers { name, email }}' })
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            res.body.user.should.have.lengthOf(1);
        })
    })
})

