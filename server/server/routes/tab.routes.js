let express = require('express');
let router = express.Router();
const TabController = require('../controller/tabController');

router.use(function timeLog(req, res, next) {
    next();
});

/**
 * return all tabs
 * # only for reports 
 * input: -
 * output: array of tab objects
 */
router.get('/', function (req, res) {
    TabController.all(function (tabs, msg) {
        if (tabs) {
            res.status(200).send(tabs);
        } else {
            res.status(404).send(msg);
        }
    });
});

/**
 * add a tab
 * # depricated - add a tabGroup including tabGroup.tabs instead
 * input: tab request-object
 * output: tab object
 */
router.post('/', function(req, res){
    TabController.add(req.body, function (newTab, msg) {
        if (newTab) {
            res.status(200).send(newTab);
        } else {
            res.status(404).send(msg);
        };
    });
});

module.exports = router;