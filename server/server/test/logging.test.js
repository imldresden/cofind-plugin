const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');

const logger = require('../log/logger');
const GroupController = require('../controller/groupController');
const TestHelper = require('./helper.test');

const config = require('../config/config.json');
let username = config.setup.users.user1.username;

let reqTabGroup;
let reqWebsiteVisit;
let reqWebsiteProposal;
let reqNote;
let userId;
let groupId;
let memberId;
let sessionId;
let websiteProposalId;
let noteId;


let notePosition =
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
                reqWebsiteVisit =
                    {
                        group: groupId,
                        user: userId,
                        link: 'website@logging.test',
                        title: 'website logging test'
                    };
                reqWebsiteProposal =
                    {
                        group: groupId,
                        user: userId,
                        link: 'website@logging.test',
                        title: 'website logging test'
                    };
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
                    TestHelper.fetchWebsiteProposal2(groupId, userId, function(websiteProposal){
                        websiteProposalId = websiteProposal._id;
                        reqNote =
                            {
                                websiteProposal: websiteProposalId,
                                user: userId,
                                notePosition: notePosition,
                                description: 'test-description'
                            };
                        TestHelper.fetchNote(websiteProposalId, userId, function(note){
                            noteId = note._id;
                        });
                    });
                });
            });
        });
    });
});

describe('Unit testing logger', function () {

    it('test login', function () {
        logger.login(username);
    });

    it('test logout', function () {
        logger.logout(username);
    });

    it('test tabGroupAdded', function () {
        logger.tabGroupAdded(groupId, reqTabGroup);
    });

    it('test websiteVisitAdded', function () {
        logger.websiteVisitAdded(groupId, reqWebsiteVisit);
    });

    it('test websiteProposalAdded', function () {
        logger.websiteProposalAdded(groupId, reqWebsiteProposal);
    });

    it('test websiteProposalDeleted', function () {
        logger.websiteProposalDeleted(groupId, websiteProposalId);
    });

    it('test noteAdded', function () {
        logger.noteAdded(groupId, reqNote);
    });

    it('test noteDeleted', function () {
        logger.noteDeleted(groupId, noteId);
    });
});
