const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqMember;
let userId;
let groupId;
let memberId;

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            reqMember =
                {
                    user: userId,
                    group: groupId
                };
        });
    });
});

describe('Unit testing the /members route', function () {

    it('POST: /members', function () {
        return request(app)
            .post('/members')
            .send(reqMember)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                memberId = response.body._id;
            });

    });

    it('GET: /members', function () {
        return request(app)
            .get('/members')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

    it('GET: /members/:__id', function () {
        return request(app)
            .get(`/members/${memberId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, memberId);
            });
    });

});
