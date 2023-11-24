const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

if (ENV === 'production') {
  config.connectionString = 'postgres://kakhijsh:7MRv93TBKqgVoGn3NLd-uWrJKHG7y4l6@flora.db.elephantsql.com/kakhijsh'
  config.max = 2;
}

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool(config);
