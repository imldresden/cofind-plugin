const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqMessage;
let groupId;
let userId;

before(function () {
    TestHelper.fetchUser(function(user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function(group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function(member) {
                reqMessage = 
                {
                    group: groupId,
                    user: userId,
                    message: 'unittest message'
                };
            });
        });
    });
});

describe('Unit testing the /messages route', function () {

    it('POST: /messages', function () {
        return request(app)
            .post('/messages')
            .send(reqMessage)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
            });
    });

    it('GET: /messages', function () {
        return request(app)
            .get('/messages')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

});
