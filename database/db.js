const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ialfie",
  password: "arepo8724",
  port: 5432,
});

module.exports = pool;
