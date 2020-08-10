const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqWebsiteVisit;
let userId;
let groupId;

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function (member) {
                reqWebsiteVisit =
                    {
                        group: groupId,
                        user: userId,
                        link: 'website@visit.test',
                        title: 'website visit test'
                    };
            });
        });
    });
});

describe('Unit testing the /website-visits route', function () {

    it('POST: /website-visits', function () {
        return request(app)
            .post('/website-visits')
            .send(reqWebsiteVisit)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
            });
    });

    it('GET: /website-visits', function () {
        return request(app)
            .get('/website-visits')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

});
