const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqTabGroup;
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
                    let tabArray = new Array();
                    tabArray.push({
                        number: '1',
                        url: 'tab1@unit.test',
                        title: 'Unittests für Dummies'
                    });
                    tabArray.push({
                        number: '2',
                        url: 'tab2@unit.test',
                        title: 'Unittests für Super-Dummies'
                    });
                    reqTabGroup =
                        {
                            session: sessionId,
                            tabs: tabArray
                        };
                });
            });
        });
    });
});

describe('Unit testing the /tab-groups route', function () {

    it('POST: /tab-groups', function () {
        return request(app)
            .post('/tab-groups')
            .send(reqTabGroup)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
            });
    });

    it('GET: /tab-groups', function () {
        return request(app)
            .get('/tab-groups')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

    it('GET: /sessions/:__id/tab-groups', function () {
        return request(app)
            .get(`/sessions/${sessionId}/tab-groups`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

});
