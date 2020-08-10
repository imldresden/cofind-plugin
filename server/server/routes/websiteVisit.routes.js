let express = require('express');
let router = express.Router();
const WebsiteVisitController = require('../controller/websiteVisitController');
const GroupController = require('../controller/groupController');

router.use(function timeLog(req, res, next) {
    next();
});

router.get('/', function (req, res) {
    WebsiteVisitController.all(function (websiteVisit, msg) {
        if (websiteVisit) {
            res.status(200).send(websiteVisit);
        } else {
            res.status(404).send(msg);
        }
    });
});

router.post('/', function(req, res){
    GroupController.addWebsiteVisit(req.body, function (newWebsiteVisit, msg) {
        if (newWebsiteVisit) {
            res.status(200).send(newWebsiteVisit);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;