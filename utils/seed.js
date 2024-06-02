const seed = require('./data');
const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

seed();