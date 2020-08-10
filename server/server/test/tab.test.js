const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqTab;
let userId;
let groupId;
let memberId;
let sessionId;

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function (member) {
                memberId = member._id;
                TestHelper.fetchSession(memberId, function (session) {
                    sessionId = session._id;
                    reqTab =
                        {
                            session: sessionId,
                            number: '1',
                            url: 'tab@unit.test',
                            title: 'Unittests für Dummies'
                        };
                });
            });
        });
    });
});

describe('Unit testing the /tabs route', function () {

    it('POST: /tabs', function () {
        return request(app)
            .post('/tabs')
            .send(reqTab)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
            });
    });

    it('GET: /tabs', function () {
        return request(app)
            .get('/tabs')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            });
    });
});
