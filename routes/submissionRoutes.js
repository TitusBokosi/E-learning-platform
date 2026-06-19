const express = require('express');
const { authenticateAccessToken, authorize } = require('../middlewares/authMiddleware');
const {
  getAllSubmissionsController,
} = require('../controllers/submissionControllers');

const submissionRoute = express.Router();

submissionRoute.use(authenticateAccessToken);

submissionRoute.get('/', getAllSubmissionsController);

module.exports = submissionRoute;
