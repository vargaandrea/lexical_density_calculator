// config.js
const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 database: 'mongodb://localhost:27017/lexical_analyzer'
};

const test = {
 database: 'mongodb://localhost:27017/lexical_analyzer_test'
};

const config = {
 dev,
 test
};

module.exports = config[env];
