var WebsiteVisit = require('../static/models/websiteVisit.js');
var Group = require('../static/models/group.js');

/**
 * adds a websiteVisit
 * input: websiteVisit request-object
 * output: websiteVisit object
 */
module.exports.add = function (visit, callback) {
    if (!visit.group) callback(null, 'bad request - group not found');
    if (!visit.user) callback(null, 'bad request - user not found');
    if (!visit.link) callback(null, 'bad request - visit-link not found');
    if (!visit.title) callback(null, 'bad request - visit-title not found');
    if (visit.group && visit.user && visit.link && visit.title) {
        let newVisit = new WebsiteVisit(visit);
        newVisit.save(function () {
            callback(newVisit, `created website-visit ${newVisit._id}`);
        });
    }
};

/**
 * returns all websiteVisits
 * input: -
 * output: array of websiteVisits
 */
module.exports.all = function (callback) {
    WebsiteVisit.find({}, function (err, docs) {
        if (err) console.log('could not get website visits');
        if (docs) {
            callback(docs, 'website visits fetched');
        }
    });
};
