# Tom's News API

To connect to the development and test databases locally, create two files named '.env.test' and '.env.development'. In each file, declare the name of the database you would like to connect to in the form: 'PGDATABASE=' followed by the database name. You will want to use '.env.test' to connect to a database of test data if applicable.

To create the databases, use 'npm install' in the terminal followed by 'npm run setup-dbs'.

Use 'npm run seed' and 'npm run test' to insert data into the development or test tables respectively.