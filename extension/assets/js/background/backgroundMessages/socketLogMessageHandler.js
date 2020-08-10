/**
 * Gets fired if the message.type == socketLog in the "gotMessage"-Function
 * @param {*} message complete message that should be handled by a socket
 */
async function handleSocketLogMessage(message) {

    var socket = await getSocket();
    var socketType = message.data.socketType;
    var data = message.data;

    switch (socketType) {
        case 'clickUserButton':
            socket.emit('clickUserButton', data.groupId, data.sessionId, data.userId, data.selectedUserId);
            break;
        case 'leaveGroup':
            console.log("leaveGroup " + data.groupId);
            socket.emit('disconnect', data.groupId, data.sessionId, data.userId);
            break;
        case 'websiteproposal added':
            socket.emit('websiteproposal added', data.groupId, data.requestWebsiteProposal);
            break;
        case 'websiteproposal deleted':
            socket.emit('websiteproposal deleted', data.groupId, data.proposalId);
            break;
        case 'explicit added':
            socket.emit('explicit added', data.groupId, data.reqExplicit);
            break;
        case 'explicit deleted':
            socket.emit('explicit deleted', data.groupId, data.sessionId, data.url);
            break;
        case 'snapshot added':
            socket.emit('snapshot added', data.groupId, data.reqSnapshot);
            break;
        case 'scroll vertical':
            data = await fillDataScrollVertical(data);
            socket.emit('scroll vertical', data.groupId, data.sessionId, data.userId, data.tabNumber, data.tabUrl, data.position);
            break;
        case 'sidebarProposalTabClick':
            socket.emit('sidebarProposalTabClick', data.groupId, data.sessionId, data.userId, data.proposalUsers, data.url, data.title);
            break;
        case 'sidebarUserTabClick':
            socket.emit('sidebarUserTabClick', data.groupId, data.sessionId, data.userId, data.section, data.sectionUserName, data.tabId, data.url, data.title);
            break;
        case 'sidebarDetailsClick':
            socket.emit('sidebarDetailsClick', data.groupId, data.sessionId, data.userId, data.section, data.sectionName, data.url);
            break;


    }

}

/**
 * collect data for vertical scroll event
 * @param data
 * @returns data object with scroll information
 */
fillDataScrollVertical = (data) => {
    return new Promise(async function (resolve, reject) {
        let tab = await getCurrentTab();

        data.groupoId = await getPersistantData("groupId");
        data.sessionId = await getPersistantData("sessionId");
        data.userId = await getPersistantData("userId");
        data.tabNumber = tab.number;
        data.tabUrl = tab.url;

        resolve(data);
    });
}