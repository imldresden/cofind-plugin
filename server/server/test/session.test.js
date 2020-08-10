const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let userId;
let memberId;
let groupId;
let sessionId;
let reqSession;

let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
let reqDevice =
{
    name: 'ThinkPad T450s',
    mac: `ICHBINEINEMAC${val}`
};

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function (member) {
                memberId = member._id;
                reqSession =
                    {
                        member: memberId,
                        device: reqDevice
                    };
            });
        });
    });
});

describe('Unit testing the /sessions route', function () {

    it('POST: /sessions', function () {
        return request(app)
            .post('/sessions')
            .send(reqSession)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                sessionId = response.body._id;
            })
    });

    it('GET: /sessions', function () {
        return request(app)
            .get('/sessions')
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /sessions/:__id', function () {
        return request(app)
            .get(`/sessions/${sessionId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, sessionId);
            });
    });

    it('PUT: /sessions/:__id/close', function () {
        return request(app)
            .put(`/sessions/${sessionId}/close`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, sessionId);
                assert.equal(response.body.isActive, false);
            });
    });

});
