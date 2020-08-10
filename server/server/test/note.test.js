const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');
const TestHelper = require('./helper.test');

let reqNote;
let notePosition;
let noteId;
let groupId;
let userId;
let proposalId;

notePosition =
    {
        startElementOffsetOfSameType: 123451,
        startElementType: 'test-startElementType',
        startElementInnerOffset: 123452,
        startElementInnerText: 'test-startElementInnerText',
        endElementOffsetOfSameType: 123453,
        endElementType: 'test-endElementType',
        endElementInnerOffset: 123454,
        endElementInnerText: 'test-endElementInnerText'
    };

before(function () {
    TestHelper.fetchUser(function (user) {
        userId = user._id;
        TestHelper.fetchGroup(userId, function (group) {
            groupId = group._id;
            TestHelper.fetchMember(userId, groupId, function (member) {
                memberId = member._id;
                TestHelper.fetchWebsiteProposal(groupId, userId, function(proposal) {
                    proposalId = proposal._id;
                    reqNote =
                    {
                        websiteProposal: proposalId,
                        user: userId,
                        notePosition: notePosition,
                        description: 'test-description'
                    };
                });
            });
        });
    });
});

describe('Unit testing the /notes route', function () {

    it('POST: /notes', function () {
        return request(app)
            .post('/notes')
            .send(reqNote)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                noteId = response.body._id;
            })
    });

    it('GET: /notes', function () {
        return request(app)
            .get('/notes')
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /notes/:__id', function () {
        return request(app)
            .get(`/notes/${noteId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, noteId);
            });
    });

    it('PUT: /notes/:__id/delete', function () {
        return request(app)
            .put(`/notes/${noteId}/delete`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, noteId);
            });
    });

});
