generateSidebarLeftEventListeners = () => {
    generateProposalEventListeners();
    generateActivityEventListeners();
    generatePrivateEventListeners();
    addSidebarDetailsClick();
}

generateProposalEventListeners = async () => {
    let tabs = document.getElementsByClassName("proposalTab");
    let groupId = await getPersistantData("groupId");
    let currentSessionId = await getPersistantData("sessionId");
    let currentUserId = await getPersistantData("userId");
    for (let tab of tabs) {
        tab.addEventListener("click", function () {
            let msg = {
                type: "socketLog",
                data: {
                    socketType: 'sidebarProposalTabClick',
                    groupId: groupId,
                    sessionId: currentSessionId,
                    userId: currentUserId,
                    proposalUsers: tab.getAttribute("data-users"),
                    url: tab.getAttribute("data-url"),
                    title: tab.getAttribute("title")
                }
            };
            sendMessageToBackend(msg);
        })
    }
}

generateActivityEventListeners = () => {
    addUserSectionEventListeners("activity");
}

generatePrivateEventListeners = () => {
    addUserSectionEventListeners("private");
}

addUserSectionEventListeners = async (section) => {
    let tabs = document.getElementsByClassName(section+"Tab");
    let groupId = await getPersistantData("groupId");
    let currentSessionId = await getPersistantData("sessionId");
    let currentUserId = await getPersistantData("userId");
    for (let tab of tabs) {
        tab.addEventListener("click", function () {
            console.log("addUserEventListeners");
            let msg = {
                type: "socketLog",
                data: {
                    socketType: 'sidebarUserTabClick',
                    groupId: groupId,
                    sessionId: currentSessionId,
                    userId: currentUserId,
                    section: section,
                    sectionUserName: tab.getAttribute("data-username"),
                    tabId: tab.getAttribute("data-user-id"),
                    url: tab.getAttribute("data-url"),
                    title: tab.getAttribute("title")
                }
            };
            sendMessageToBackend(msg);
        })
    }
}

addSidebarDetailsClick = async () => {
    let detailButtons = document.getElementsByClassName("sidebar-details-button");
    let groupId = await getPersistantData("groupId");
    let currentSessionId = await getPersistantData("sessionId");
    let currentUserId = await getPersistantData("userId");    
    for (let btn of detailButtons) {
        btn.addEventListener("click", function () {
            console.log("sidebarDetailsClick");
            let msg = {
                type: "socketLog",
                data: {
                    socketType: 'sidebarDetailsClick',
                    groupId: groupId,
                    sessionId: currentSessionId,
                    userId: currentUserId,
                    section: btn.getAttribute("data-section"),
                    sectionName: btn.getAttribute("data-section-name"),
                    url: btn.getAttribute("href")
                }
            };
            sendMessageToBackend(msg);
        })
    }
}
