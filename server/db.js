const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(path.join(__dirname, 'data', 'leads.json'));
const db = low(adapter);

// Initialize default structure
db.defaults({ inquiries: [], quotes: [] }).write();

module.exports = db;
