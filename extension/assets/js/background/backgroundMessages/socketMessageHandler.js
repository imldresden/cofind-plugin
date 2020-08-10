/**
 * Gets fired if the message.type == socket in the "gotMessage"-Function
 * @param {*} message complete message that should be handled by a socket
 */
async function handleSocketMessage(message) {

    var socket = await getSocket();
    var socketType = message.data.socketType;
    var data = message.data;

    switch (socketType) {
        case 'joinGroup':
            console.log("joinGroup " + data.groupId);
            socket.emit('joinGroup', data.groupId);
            break;
        case 'leaveGroup':
            console.log("leaveGroup " + data.groupId);
            socket.emit('disconnect', data.groupId, data.sessionId, data.userId);
            break;
        case 'sessionDisconnect':
            console.log("groupId: " + data.groupId);
            console.log("sessionId: " + data.sessionId);
            console.log("userId: " + data.userId);
            socket.emit('sessionDisconnect', data.groupId, data.sessionId, data.userId);
            break;
        case 'websiteproposal added':
            socket.emit('websiteproposal added', data.groupId, data.sessionId, data.requestWebsiteProposal);
            break;
        case 'websiteproposal deleted':
            socket.emit('websiteproposal deleted', data.groupId, data.sessionId, data.proposalId);
            break;
        case 'explicit added':
            socket.emit('explicit added', data.groupId, data.sessionId, data.reqExplicit);
            break;
        case 'explicit deleted':
            socket.emit('explicit deleted', data.groupId, data.sessionId, data.url, data.explicitId);
            break;
        case 'snapshot added':
            socket.emit('snapshot added', data.groupId, data.sessionId, data.reqSnapshot);
            break;

    }

}