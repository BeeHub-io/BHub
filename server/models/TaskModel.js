const myURI = 'postgres://tmmkiwzt:i719EAmCmFqNGX-GsPTm_NTyTAea9Jat@lallah.db.elephantsql.com:5432/tmmkiwzt';

const URI = process.env.PG_URI || myURI;

const { Pool } = require('pg');

const pool = new Pool({connectionString: URI})

module.exports = {
  query: function (text, params, callback) {
    return pool.query(text, params, callback);
  }
};