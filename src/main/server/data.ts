const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const adapter = new FileSync(path.resolve(__dirname, "../data/db.json"));
const db = low(adapter);

db.defaults({
  projects: [],
  settings: {},
}).write();

export default db;
