const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');

let reqUser;
let userId;

before(function () {
    let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
    reqUser =
        {
            username: `unittest${val}`,
            password: 'unittest'
        };
});

describe('Unit testing the /users route', function () {

    it('POST: /users', function () {
        return request(app)
            .post('/users')
            .send(reqUser)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body.isDeleted, false);
                chaiAssert.isString(response.body.createdAt);
                userId = response.body._id;
            })
    });

    it('GET: /users', function () {
        return request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /users/:__id', function () {
        return request(app)
            .get(`/users/${userId}`)
            //.get('/users/5cf1108dd0ca562f64e46b1b')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body._id, userId);
            });
    });

    it('GET: /users/:__id/member/groups', function () {
        return request(app)
            .get(`/users/${userId}/member/groups`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
                for (group in response.body){
                    assert.equal(response.body[group].isactive, true);
                }
            })
    });

    it('GET: /users/login/:username/:password', function () {
        return request(app)
            .get(`/users/login/${reqUser.username}/${reqUser.password}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body.isDeleted, false);
                chaiAssert.isString(response.body.createdAt);
            })
    });

    it('DELETE: /users/__:id', function () {
        return request(app)
            .delete(`/users/${userId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body.isDeleted, true);
                chaiAssert.isString(response.body.createdAt);
            })
    });

});
