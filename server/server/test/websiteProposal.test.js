const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqWebsiteProposal;
let proposalId;
let userId;
let groupId;

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function (member) {
                reqWebsiteProposal = 
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

describe('Unit testing the /website-proposals route', function () {

    it('POST: /website-proposals', function () {
        return request(app)
            .post('/website-proposals')
            .send(reqWebsiteProposal)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                proposalId = response.body._id;
            });
    });

    it('GET: /website-proposals', function () {
        return request(app)
            .get('/website-proposals')
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            })
    });

    it('PUT: /website-proposals/:__id/delete', function () {
        console.log('delete proposal: '+proposalId);
        return request(app)
            .put(`/website-proposals/${proposalId}/delete`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, proposalId);
            });
    });

});
