/**
 * select ip of current server
 * @type {string}
 */
// var server = "http://localhost:3000";
// Ansion
 var server = "http://141.76.67.204:3000";



getServer = async () => {
    return this.server;
}

/**
 * get latestGroup object via rest
 * only use if socket not available
 * @returns latestGroup object
 */
async function getLatestGroup (){
    return get(server+"/groups/latest").then(function(group){
        console.log("got group...");
        return group;
    });
}

/**
 * gets the currente OS of the device that is currently running this script.
 * @returns os as text
 */
function getOs() {
    var userAgent = navigator.userAgent;
    console.log(userAgent);
    //Converts the user-agent to a lower case string
    userAgent = userAgent.toLowerCase();
    //Fallback in case the operating system can't be identified
    var os = "Device";
    //Corresponding arrays of user-agent strings and operating systems. Can be completed further
    match = ["windows nt 10", "windows nt 6.3", "windows nt 6.2", "windows nt 6.1", "windows nt 6.0", "windows nt 5.2", "windows nt 5.1", "windows xp", "windows nt 5.0", "windows me", "win98", "win95", "win16", "macintosh", "mac os x", "mac_powerpc", "android", "linux", "ubuntu", "iphone", "ipod", "ipad", "blackberry", "webos"];
    result = ["Windows 10", "Windows 8.1", "Windows 8", "Windows 7", "Windows Vista", "Windows Server 2003/XP x64", "Windows XP", "Windows XP", "Windows 2000", "Windows ME", "Windows 98", "Windows 95", "Windows 3.11", "Mac OS X", "Mac OS X", "Mac OS 9", "Android", "Linux", "Ubuntu", "iPhone", "iPod", "iPad", "BlackBerry", "Mobile"];
    for (var i = 0; i < match.length; i++) {
        //If the string is contained within the user-agent then set the os
        if (userAgent.indexOf(match[i]) !== -1) {
            os = result[i];
            break;
        }
    }
    return os;
}

/**
 * THIS FUNCTION IS NOT WORKING; DUE TO THE LACK OF READING MAC´S ...
 * Cretes a guid from the current device to identify the return of a users device.
 * This way, the user does not have to rejoin as a different session, but can be
 * reactivate the previous one.
 * @returns guid
 */
function guid() {
    var nav = window.navigator;
    var screen = window.screen;
    var guid = nav.mimeTypes.length;
    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';
    // random number to avoid closing session wirh same devices (e.g. similar tablets)
    let rnd = Math.floor(Math.random() * 1000000000);
    guid += rnd;
    return guid;
};
