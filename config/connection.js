const { connect, connection } = require('mongoose');

const connectionString = 'mongodb+srv://ponchobt:diegoangel@cluster0.ssmefhs.mongodb.net/social';

connect(connectionString);

module.exports = connection;
