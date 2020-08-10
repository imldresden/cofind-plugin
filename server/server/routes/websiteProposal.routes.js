let express = require('express');
let router = express.Router();
const WebsiteProposalController = require('../controller/websiteProposalController');
const GroupController = require('../controller/groupController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all websiteProposals
 * # only for reports
 * input: -
 * output: array of websiteProposal objects
 */
router.get('/', function (req, res) {
    WebsiteProposalController.all(function (websiteProposal, msg) {
        if (websiteProposal) {
            res.status(200).send(websiteProposal);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a websiteProposal
 * - create websiteProposal
 * - add websiteProposal to group.websiteProposals
 * input: websiteProposal request-object
 * output: websiteProposal object
 */
router.post('/', function(req, res){
    GroupController.addWebsiteProposal(req.body, function (newWebsiteProposal, msg) {
        if (newWebsiteProposal) {
            res.status(200).send(newWebsiteProposal);
        } else {
            res.status(404).send(msg);
        };
    });
});

/**
 * set a websiteProposal to isDeleted = true
 * input: websiteProposal__id
 * output: websiteProposal object
 */
router.put('/:__id/delete', function (req, res) {
    WebsiteProposalController.delete(req.params.__id, function (websiteProposal, msg) {
        if (websiteProposal) {
            res.status(200).send(websiteProposal);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;