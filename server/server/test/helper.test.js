const app = require('../index');
const UserController = require('../controller/userController');
const GroupController = require('../controller/groupController');
const MemberController = require('../controller/memberController');
const WebsiteProposalController = require('../controller/websiteProposalController');
const DeviceController = require('../controller/deviceController');
const SessionController = require('../controller/sessionController');
const TabGroupController = require('../controller/tabGroupController');
const MessageController = require('../controller/messageController');
const WebsiteVisitController = require('../controller/websiteVisitController');
const NoteController = require('../controller/noteController');

let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
let reqDevice =
{
    name: 'ThinkPad T450s',
    mac: `ICHBINEINEMAC${val}`
};

module.exports.fetchUser = function (callback) {
    let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
    let reqUser =
    {
        username: `visittest${val}`,
        password: 'visittest'
    };
    UserController.signupUser(reqUser, function (user, msg) {
        // console.log(`signed up ${user._id}`);
        callback(user);
    });
};

module.exports.fetchGroup = function (userId, callback) {
    GroupController.all(function (groups, msg) {
        if (groups.length > 0) {
            callback(groups[groups.length - 1])
        } else {
            let reqGroup =
            {
                user: userId,
                name: 'unittest-group',
                description: 'for unittest'
            };
            GroupController.add(reqGroup, function (group, msg) {
                callback(group);
            });
        }
    });
};

module.exports.fetchMember = function (userId, groupId, callback) {
    let reqMember =
    {
        user: userId,
        group: groupId
    };
    GroupController.addMember(reqMember, function (member, msg) {
        callback(member);
    });
};

module.exports.fetchWebsiteProposal = function (groupId, userId, callback) {
    let reqWebsiteProposal =
    {
        group: groupId,
        user: userId,
        link: 'website@visit.test',
        title: 'website visit test'
    };
    GroupController.addWebsiteProposal(reqWebsiteProposal, function (proposal) {
        callback(proposal);
    })
};

module.exports.fetchWebsiteProposal2 = function (groupId, userId, callback) {
    let reqWebsiteProposal =
        {
            group: groupId,
            user: userId,
            link: 'website@logging.test',
            title: 'website logging test'
        };
    GroupController.addWebsiteProposal(reqWebsiteProposal, function (proposal) {
        callback(proposal);
    })
};

module.exports.fetchDevice = function (callback) {
    DeviceController.getOrAdd(reqDevice, function (device, msg) {
        callback(device);
    });
};

module.exports.fetchSession = function (memberId, callback) {
    let reqSession =
    {
        member: memberId,
        device: reqDevice
    };
    MemberController.addSession(reqSession, function (session) {
        callback(session);
    });
};

module.exports.fetchTabGroup = function (sessionId, callback) {
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
    SessionController.addTabGroup(reqTabGroup, function (tabGroup, msg) {
        // console.log('CREATED TABGROUP');
        // console.log(tabGroup);
        callback(tabGroup);
    });
};

module.exports.fetchMessage = function (groupId, userId, callback) {
    reqMessage =
        {
            group: groupId,
            user: userId,
            message: 'unittest message'
        };
    GroupController.addMessage(reqMessage, function (message) {
        callback(message);
    })
    // MessageController.add(reqMessage, function (message, msg) {
    //     callback(message);
    // });
}

module.exports.fetchWebsiteVisit = function (groupId, userId, callback) {
    reqWebsiteVisit =
        {
            group: groupId,
            user: userId,
            link: 'website@visit.test',
            title: 'website visit test'
        };
    GroupController.addWebsiteVisit(reqWebsiteVisit, function (visit) {
        callback(visit);
    });
}

module.exports.fetchNote = function (proposalId, userId, callback) {
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
    reqNote =
        {
            websiteProposal: proposalId,
            user: userId,
            notePosition: notePosition,
            description: 'test-description'
        };
    WebsiteProposalController.addNote(reqNote, function (note) {
        callback(note);
    });
}