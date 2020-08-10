const SessionController = require('../controller/sessionController');
const GroupController = require('../controller/groupController');
const WebsiteProposalController = require('../controller/websiteProposalController');
const NoteController = require('../controller/noteController');
const TabController = require('../controller/tabController');
const ExplicitController = require('../controller/explicitController');
const Logger = require('../log/logger');
const ConsoleLogger = require('../log/consoleLogger');


/**
 * apply socket connection
 */
module.exports = (io) => {
    io.on('connection', function (socket) {
        console.log("client connected...");
        var emitCurrentGroup = function (group) {
            if(group == "transport close") {
                console.log("group = transport close");
                return;
            }
            GroupController.getGroupEmitObject(group, function (currentGroup, msg) {
                if (currentGroup) {
                    // console.log("send group modified...");
                    io.to(group).emit('group modified', currentGroup);
                }
                // else {
                //     io.to(socket.id).emit('group modified', msg);
                // }
            });
        };

        // console.log(socket);
        // socket.join('group1');
        // console.log('an user connected');
        // io.emit('chat message', 'user connected');
        // socket.on('chat message', function (msg) {
        //     io.to('5cfe8bfcb694a2446c61297c').emit('chat message', msg);
        //     io.to('group__id2').emit('chat message', 'new msg in other group');
        // });

        socket.on('joinGroup', function (groupId) {
            console.log("join group " + groupId);
            socket.join(groupId);
            emitCurrentGroup(groupId);
        });

        // only for logging so far
        socket.on('sessionConnect', function (groupId, sessionId, userId) {
            // Logger.sessionConnect(groupId, sessionId, userId)
        });

        // close one session
        // if closed session is last session -> logout
        socket.on('sessionDisconnect', function (groupId, sessionId, userId) {
            console.log("socket.handler sessionDisconnect groupId: " + groupId + " sessionId: " + sessionId + " userId: " + userId);
            // Logger.sessionDisconnect(groupId, sessionId, userId)

            SessionController.close(sessionId, function(activeSessions, msg){
                emitCurrentGroup(groupId);
            });
        });

        // close all sessions
        socket.on('disconnect', function (groupId, sessionId, userId, mac) {

            // Logger.logout(userId)
            // GroupController.logout(groupId, userId, function (member, msg) {
            //     emitCurrentGroup(groupId);
            // });
            SessionController.close(sessionId, function (member, msg) {
                // console.log("closed sessions...");
                emitCurrentGroup(groupId);
            });
        });

        // add tabGroup
        // return currentGroup
        socket.on('tabgroup added', function (group, reqTabGroup) {
            // Logger.tabGroupAdded(group, reqTabGroup);
            // TabController.setShareFlag(group, reqTabGroup, function (reqTabgroup, msg) {
            SessionController.addTabGroup(reqTabGroup, function (newTabGroup, msg) {
                if (newTabGroup) {
                    emitCurrentGroup(group);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
            // });
        });

        // add websiteVisit
        // return currentGroup
        socket.on('websitevisit added', function (group, reqWebsiteVisit) {
            // Logger.websiteVisitAdded(group, reqWebsiteVisit);
            GroupController.addWebsiteVisit(reqWebsiteVisit, function (newWebsiteVisit, msg) {
                if (newWebsiteVisit) {
                    emitCurrentGroup(group);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
        });

        // add websiteProposal
        // return currentGroup
        socket.on('websiteproposal added', function (groupId, sessionId, reqWebsiteProposal, tab) {
            Logger.websiteProposalAdded(groupId, sessionId, reqWebsiteProposal);
            GroupController.addWebsiteProposal(reqWebsiteProposal, function (newWebsiteProposal, msg) {
                if (newWebsiteProposal) {
                    emitCurrentGroup(groupId);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
        });

        // delete websiteProposal
        // return currentGroup
        socket.on('websiteproposal deleted', function (groupId, sessionId, proposalId) {
            Logger.websiteProposalDeleted(groupId, sessionId, proposalId);
            WebsiteProposalController.delete(proposalId, function (websiteProposal, msg) {
                if (websiteProposal) {
                    emitCurrentGroup(groupId);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
        });

        socket.on('snapshot added', function (groupId, sessionId, reqSnapshot) {
            Logger.snapshotAdded(groupId, sessionId, reqSnapshot);
            SessionController.addSnapshot(reqSnapshot, function (newSnapshot, msg) {
                if (newSnapshot) {
                    emitCurrentGroup(groupId);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
        });

        socket.on('explicit added', function (groupId, sessionId, reqExplicit) {
            // console.log('explicit added...');
            Logger.explicitAdded(groupId, sessionId, reqExplicit);
            SessionController.addExplicit(reqExplicit, function (newExplicit, msg) {
                if (newExplicit) {
                    emitCurrentGroup(groupId);
                } else {
                    io.to(socket.id).emit('group modified', msg);
                }
            });
        });

        socket.on('explicit deleted', function (groupId, sessionId, url, explicitId) {
            // console.log('explicit deleted');
            Logger.explicitDeleted(groupId, sessionId, url, explicitId);
            ExplicitController.deleteExplicitTab(sessionId, url, function (deleted) {
                if (deleted) {
                    emitCurrentGroup(groupId);
                }
            });
        });

        socket.on('tabCreated', function (sessionId, userId, tabNumber) {
            if(!sessionId || !userId || userId == "null") return;
            Logger.tabCreated(sessionId, userId, tabNumber);
            ConsoleLogger.tabCreated(sessionId, userId, tabNumber);
        });
        socket.on('tabRemoved', function (sessionId, userId, tabNumber, windowId, isWindowClosing) {
            if(!sessionId || !userId || userId == "null") return;
            Logger.tabRemoved(sessionId, userId, tabNumber, windowId, isWindowClosing);
            ConsoleLogger.tabRemoved(sessionId, userId, tabNumber, windowId, isWindowClosing);
        });
        socket.on('tabMoved', function (sessionId, userId, tabNumber, fromIndex, toIndex) {
            if(!sessionId || !userId) return;
            Logger.tabMoved(sessionId, userId, tabNumber, fromIndex, toIndex);
            ConsoleLogger.tabMoved(sessionId, userId, tabNumber, fromIndex, toIndex);
        });
        socket.on('tabActivated', function (sessionId, userId, previousTabNumber, tabNumber, windowId) {
            if(!sessionId || !userId || userId == "null") return;
            Logger.tabActivated(sessionId, userId, previousTabNumber, tabNumber, windowId);
            ConsoleLogger.tabActivated(sessionId, userId, previousTabNumber, tabNumber, windowId);
        });
        socket.on('tabUrlUpdated', function (sessionId, userId, toTabId, toTabUrl) {
            if(!sessionId || !userId || userId == "null") return;
            Logger.tabUrlUpdated(sessionId, userId, toTabId, toTabUrl);
            ConsoleLogger.tabUrlUpdated(sessionId, userId, toTabId, toTabUrl);
        });

        socket.on('userDetailsClick', function (userId) {
            if(!userId) return;
            Logger.userDetailsClick(userId);
            ConsoleLogger.userDetailsClick(userId);
        });

        socket.on('test', function (message) {
            console.log("test");
            console.log("socket test: " + JSON.stringify(message));
        });

        socket.on('clickUserButton', function (groupId, sessionId, userId, selectedUserId) {
            // console.log("clickUserButton...");
            Logger.clickUserButton(groupId, sessionId, userId, selectedUserId);
            ConsoleLogger.clickUserButton(groupId, sessionId, userId, selectedUserId);
        });

        socket.on('scroll vertical', function (groupId, sessionId, userId, tabId, tabUrl, tabPosition) {
            // console.log("scroll vertical...");
            Logger.scrollVertical(groupId, sessionId, userId, tabId, tabUrl, tabPosition);
            ConsoleLogger.scrollVertical(groupId, sessionId, userId, tabId, tabUrl, tabPosition);
        });

        ////////////////////////////////////////////////////////////////////////////////////////////
        // SIDEBAR
        ////////////////////////////////////////////////////////////////////////////////////////////

        socket.on('sidebarDetailsClick', function (groupId, sessionId, userId, section, sectionName, url) {
            // console.log("sidebarDetailsClick...");
            Logger.sidebarDetailsClick(sessionId, userId, section, sectionName, url);
            ConsoleLogger.sidebarDetailsClick(sessionId, userId, section, sectionName, url);
        });

        socket.on('sidebarProposalTabActivate', function (groupId, sessionId, section, sectionUserName, tabId, userId, url, title) {
            // console.log("sidebarTabActivate...");
            Logger.sidebarProposalTabActivate(sessionId, userId, section, sectionUserName, tabId, url, title);
            ConsoleLogger.sidebarProposalTabActivate(sessionId, userId, section, sectionUserName, tabId, url, title);
        });
        socket.on('sidebarUserTabActivate', function (groupId, sessionId, section, sectionUserName, tabId, userId, url, title) {
            // console.log("sidebarTabActivate...");
            Logger.sidebarUserTabActivate(sessionId, userId, section, sectionUserName, tabId, url, title);
            ConsoleLogger.sidebarUserTabActivate(sessionId, userId, section, sectionUserName, tabId, url, title);
        });

        socket.on('sidebarProposalTabClick', function (groupId, sessionId, userId, proposalUsers, url, title) {
            // console.log("sidebarProposalTabClick...");
            Logger.sidebarProposalTabClick(sessionId, userId, proposalUsers, url, title);
            ConsoleLogger.sidebarProposalTabClick(sessionId, userId, proposalUsers, url, title);
        });
        socket.on('sidebarUserTabClick', function (groupId, sessionId, userId, section, sectionUserName, tabId, url, title) {
            // console.log("sidebarUserTabClick...");
            Logger.sidebarUserTabClick(sessionId, userId, section, sectionUserName, tabId, url, title);
            ConsoleLogger.sidebarUserTabClick(sessionId, userId, section, sectionUserName, tabId, url, title);
        });


        // notes unused
        //
        // // add note
        // // return currentGroup
        // socket.on('note added', function (groupId, sessionId, userId, reqWebsiteProposal) {
        //     GroupController.addWebsiteProposal(reqWebsiteProposal, function (newWebsiteProposal, newNote, msg) {
        //         if (newWebsiteProposal) {
        //             // Logger.noteAdded(groupId, sessionId, userId, newWebsiteProposal, newNote);
        //             emitCurrentGroup(groupId);
        //         } else {
        //             // Logger.noteAdded(groupId, sessionId, userId, reqWebsiteProposal, null);
        //             io.to(socket.id).emit('group modified', msg);
        //         }
        //     });
        // });
        //
        // // delete note
        // // return currentGroup
        // socket.on('note deleted', function (groupId, sessionId, noteId) {
        //     // Logger.noteDeleted(groupId, sessionId, noteId);
        //     NoteController.delete(noteId, function (note, msg) {
        //         if (note) {
        //             emitCurrentGroup(groupId);
        //         } else {
        //             io.to(socket.id).emit('group modified', msg);
        //         }
        //     });
        // });

        // socket.on('siteCommentBoxOpenClose', function (sessionId, userId) {
        //     Logger.siteCommentBoxOpenClose(sessionId, userId);
        // });
        // socket.on('siteCommentBoxShowNote', function (sessionId, userId, noteId) {
        //     Logger.siteCommentBoxShowNote(sessionId, userId, noteId);
        // });
        // socket.on('siteCommentBoxDetailsOpen', function (sessionId, userId, noteId) {
        //     Logger.siteCommentBoxDetailsOpen(sessionId, userId, noteId);
        // });
        // socket.on('siteCommentBoxDetailsClose', function (sessionId, userId, noteId) {
        //     Logger.siteCommentBoxDetailsClose(sessionId, userId, noteId);
        // });

        // socket.on('commentBubbleOpen', function (sessionId, userId, noteId) {
        //     Logger.commentBubbleOpen(sessionId, userId, noteId);
        // });
        //
        // socket.on('commentBubbleClose', function (sessionId, userId, noteId) {
        //     Logger.commentBubbleClose(sessionId, userId, noteId);
        // });

    });
} 