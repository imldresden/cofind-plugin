const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqGroup;
let userId;
let groupId;

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        reqGroup =
            {
                user: userId,
                name: 'unittest-group',
                description: 'for unittest',
                uiMode: 'auto'
            };
    });
});

/**
 * for whole group test
 */
let groupId2;
let userId2;
let memberId;
let sessionId;
let proposalId;

let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
let reqDevice =
{
    name: 'ThinkPad T480s',
    mac: `ICHBINEINEMAC${val}`
};

before(function () {
    TestHelper.fetchUser(function (user) {
        userId2 = user._id;
        TestHelper.fetchGroup(userId2, function (group) {
            groupId2 = group._id;
            TestHelper.fetchMember(userId2, groupId2, function (member) {
                memberId = member._id;
                TestHelper.fetchSession(memberId, function (session) {
                    sessionId = session._id;
                    TestHelper.fetchTabGroup(sessionId, function (tabGroup) {
                        tabGroupId = tabGroup._id;
                        TestHelper.fetchTabGroup(sessionId, function (tabGroup) {
                            tabGroupId2 = tabGroup._id;
                            TestHelper.fetchMessage(groupId2, userId2, function (message) {
                                messageId = message._id;
                                TestHelper.fetchWebsiteVisit(groupId2, userId2, function (visit) {
                                    visitId = visit._id;
                                    TestHelper.fetchWebsiteProposal(groupId2, userId2, function (proposal) {
                                        proposalId = proposal._id;
                                        TestHelper.fetchNote(proposalId, userId2, function (note) {
                                            noteId = note._id;
                                        })
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

describe('Unit testing the /groups route', function () {

    it('POST: /groups', function () {
        return request(app)
            .post('/groups')
            .send(reqGroup)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body.user, reqGroup.user);
                chaiAssert.isString(response.body.createdAt);
                groupId = response.body._id;
            });
    });

    it('GET: /groups', function () {
        return request(app)
            .get('/groups')
            .then(function (response) {
                assert.equal(response.status, 200)
            });
    });

    it('GET: /users/:__id/owner/groups', function () {
        return request(app)
            .get(`/users/${userId}/owner/groups`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /users/:__id/member/groups', function () {
        return request(app)
            .get(`/users/${userId}/member/groups`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isArray(response.body);
            });
    });

    it('POST: /groups/:__id/join/users/:__id', function () {
        return request(app)
            .post(`/groups/${groupId}/join/users/${userId}`)
            .send(reqDevice)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                assert.equal(response.body.isActive, true);
                // chaiAssert.isArray(response.body.members);
                // assert(response.body.members.length > 0);
                chaiAssert.isString(response.body._id);
                chaiAssert.isString(response.body.member);
                chaiAssert.isString(response.body.device);
            });
    });

    it('GET: /groups/:__id/current', function () {
        return request(app)
            .get(`/groups/${groupId2}/current`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                assert.equal(response.status, 200);
                chaiAssert.isObject(response.body);
                // for (m in response.body.members){
                //     for (s in response.body.members[m].sessions){
                //         if(response.body.members[m].sessions[s].tabGroups){
                //             console.log('tabGroups');
                //             console.log(response.body.members[m].sessions[s].tabGroups);
                //             for(tg in response.body.members[m].sessions[s].tabGroups){
                //                 console.log(response.body.members[m].sessions[s].tabGroups[tg]);
                //             }
                //         }
                //     }
                // }
            });
    });

    it('PUT: /groups/:__id/delete', function () {
        return request(app)
            .put(`/groups/${groupId}/delete`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, groupId);
            });
    });

});
