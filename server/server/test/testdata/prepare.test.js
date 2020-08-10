const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../../index');

let reqUser;
let reqGroup;
let reqMember;
let reqMessage;
let reqDevice;
let reqSession;
let reqTabGroup;
let reqWebsiteProposal;
let reqNotePosition;
let reqNote;
let reqWebsiteVisit;

let userId;
let groupId;
let memberId;
let messageId;
let deviceId;
let sessionId;
let tabGroupId;
let websiteProposalId;
let noteId;
let websiteVisitId;


let fetchUserId = function (callback) {
    return request(app)
        .post('/users')
        .send(reqUser)
        .expect('Content-Type', /json/)
        .then(function (response) {
            userId = response.body[0]._id;
            callback();
        });
};

let fetchGroupId = function (callback) {
    return request(app)
        .post('/users')
        .send(reqUser)
        .expect('Content-Type', /json/)
        .then(function (response) {
            groupId = response.body[0]._id;
            callback();
        });
};

let fetchDeviceId = function (callback) {
    return request(app)
        .post('/devices')
        .send(reqDevice)
        .expect('Content-Type', /json/)
        .then(function (response) {
            deviceId = response.body[0]._id;
            callback();
        });
};

let fetchSessionId = function (callback) {
    return request(app)
        .post('/sessions')
        .send(reqSession)
        .expect('Content-Type', /json/)
        .then(function (response) {
            sessionId = response.body[0]._id;
            callback();
        });
};

let fetchMemberId = function (callback) {
    return request(app)
        .post('/members')
        .send(reqMember)
        .expect('Content-Type', /json/)
        .then(function (response) {
            memberId = response.body[0]._id;
            callback();
        });
};

let fetchTabGroupId = function (callback) {
    return request(app)
        .post('/tab-groups')
        .send(reqTabGroup)
        .expect('Content-Type', /json/)
        .then(function (response) {
            tabGroupId = response.body[0]._id;
            callback();
        });
}

let fetchWebsiteProposalId = function (callback) {
    return request(app)
        .post('/website-proposals')
        .send(reqWebsiteProposal)
        .expect('Content-Type', /json/)
        .then(function (response) {
            websiteProposalId = response.body[0]._id;
            callback();
        });
}

let fetchNoteId = function (callback) {
    return request(app)
        .post('/notes')
        .send(reqNote)
        .expect('Content-Type', /json/)
        .then(function (response) {
            noteId = response.body[0]._id;
            callback();
        });
}

let fetchMessageId = function (callback) {
    return request(app)
        .post('/messages')
        .send(reqMessage)
        .expect('Content-Type', /json/)
        .then(function (response) {
            messageId = response.body[0]._id;
            callback();
        });
}

let fetchWebsiteVisitId = function (callback) {
    return request(app)
        .post('/website-visits')
        .send(reqWebsiteVisit)
        .expect('Content-Type', /json/)
        .then(function (response) {
            websiteVisitId = response.body[0]._id;
            callback();
        });
}

before(function () {

    // prepare user
    let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
    reqUser =
        {
            username: `unittest${val}`,
            password: 'unittest'
        };

    reqDevice =
        {
            name: 'ThinkPad T450s',
            mac: `ICHBINEINEMAC${val}`
        };

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

    reqNotePosition =
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

    


});



describe('Unit testing the /users route', function () {

    it('prepare all test data', function () {
        fetchUserId(function () {
            reqGroup =
                {
                    name: 'unittest-group',
                    description: 'for unittest',
                    user_id: userId
                };
            fetchGroupId(function () {
                reqMember =
                    {
                        user_id: userId,
                        group_id: groupId
                    };
                fetchMemberId(function () {
                    fetchDeviceId(function () {
                        reqSession =
                            {
                                member_id: memberId,
                                device_id: deviceId
                            };
                        fetchSessionId(function () {
                            reqTabGroup =
                                {
                                    session_id: sessionId,
                                    tabs: tabArray
                                };
                            fetchTabGroupId()
                            .then(function (response) {
                                assert.equal(response.status, 200);
                            });
                        });
                    });
                });
                reqWebsiteProposal =
                    {
                        group_id: groupId,
                        user_id: userId,
                        link: 'website@visit.test',
                        title: 'website visit test'
                    };
                fetchWebsiteProposalId(function () {
                    reqNote =
                        {
                            websiteProposal_id: websiteProposalId,
                            user_id: userId,
                            notePosition: notePosition,
                            description: 'test-description'
                        };
                    fetchNoteId()
                    .then(function (response) {
                        assert.equal(response.status, 200);
                    });
                });
                reqMessage =
                    {
                        group_id: groupId,
                        user_id: userId,
                        message: 'unittest message'
                    };
                fetchMessageId()
                .then(function (response) {
                    assert.equal(response.status, 200);
                });
                reqWebsiteVisit =
                    {
                        group_id: groupId,
                        user_id: userId,
                        link: 'website@visit.test',
                        title: 'website visit test'
                    };
                fetchWebsiteVisitId()
                .then(function (response) {
                    assert.equal(response.status, 200);
                });
            });
        });
        return;
    });

});
