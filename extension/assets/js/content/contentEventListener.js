/**
 * handle vertical scroll event for logging
 * using window.pageYOffset as dynamic reference
 * @type {number}
 */

let oldPos = window.pageYOffset;
let newPos = oldPos;

let firstLast = -1;
let secondLast = -1;

let timeout = null;

var locked = false;

window.addEventListener('scroll', function (e) {
    newPos = Math.floor(window.pageYOffset);
    // if position not changed -> reset and return
    if (newPos == firstLast) {
        firstLast = -1;
        secondLast = -1;
        return;
    }
    // if first or second scroll event
    // -> no direction change recognition possible
    if (secondLast >= 0) {
        // if direction changed -> log anyway
        if ((secondLast < newPos && newPos < firstLast) || (secondLast > newPos && newPos > firstLast)) {
            clearTimeout(timeout);
            firstLast = -1;
            secondLast = -1;
            logScrollEvent(newPos);
            return;
        }
    }

    // if same direction
    // -> reset timer
    // -> set new timer with new position
    clearTimeout(timeout);
    // set last positions
    secondLast = firstLast;
    firstLast = newPos;
    // send log to queue
    timeout = setTimeout(function () {
        // console.log(newPos);
        logScrollEvent(newPos);
        firstLast = -1;
        secondLast = -1;
        // two events separated by less than 0.2 seconds do count as a single one
    }, 200);

});

logScrollEvent = async (position) => {
    // missing data is filled in backend socketLogMessageHandler
    let msg = {
        type: "socketLog",
        data: {
            socketType: 'scroll vertical',
            groupId: null,
            sessionId: null,
            userId: null,
            tabNumber: null,
            tabUrl: null,
            position: position
        }
    };
    sendMessageToBackend(msg);
}