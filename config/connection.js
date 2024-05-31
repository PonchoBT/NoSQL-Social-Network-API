const { connect, connection } = require('mongoose');

connect('mongodb+srv://ponchobt:diegoangel@cluster0.ssmefhs.mongodb.net/social');

module.exports = connection;