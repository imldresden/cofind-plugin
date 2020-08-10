let express = require('express');
let router = express.Router();

/**
 * require router files
 */
const userRoutes = require('./user.routes');
const groupRoutes = require('./group.routes');
const messageRoutes = require('./message.routes');
const memberRoutes = require('./member.routes');
const websiteProposalRoutes = require('./websiteProposal.routes');
const websiteVisitRoutes = require('./websiteVisit.routes');
const tabRoutes = require('./tab.routes');
const tabGroupRoutes = require('./tabGroup.routes');
const deviceRoutes = require('./device.routes');
const sessionRoutes = require('./session.routes');
const noteRoutes = require('./note.routes');
const notePositionRoutes = require('./notePosition.routes');
const configRoutes = require('./config.routes');

/**
 * map routes to router files
 */
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/messages', messageRoutes);
router.use('/members', memberRoutes);
router.use('/website-proposals', websiteProposalRoutes);
router.use('/website-visits', websiteVisitRoutes);
router.use('/tabs', tabRoutes);
router.use('/tab-groups', tabGroupRoutes);
router.use('/devices', deviceRoutes);
router.use('/sessions', sessionRoutes);
router.use('/notes', noteRoutes);
router.use('/note-positions', notePositionRoutes);
router.use('/config', configRoutes);

module.exports = router;