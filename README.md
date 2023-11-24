# Tom's News API

Hosted App: https://its-the-news-2.onrender.com

## Project Summary 
This project is planning to be a basic news app, containing articles for the user to browse and interact with. Features include being able to post comments on certain articles, increment a vote count for each article and search for articles by topic. 

## Setup

### Cloning

Github link: https://github.com/tomwvwest/backend-project  

Use the command ```git clone <insert-link>``` in your code terminal to setup in your coding program.

### Setting up .env files

To connect to the development and test databases locally, create two files named ```.env.test``` and ```.env.development```. In each file, declare the name of the database you would like to connect to in the form: ```PGDATABASE=``` followed by the database name (```nc_news``` or ```nc_news_test```). You will want to use ```.env.test``` to connect to a database of test data if applicable. 

### Installing Databases and Dependancies

To create the databases, use ```npm install``` in the terminal followed by ```npm run setup-dbs```.

Use ```npm run seed``` and ```npm run test``` to insert data into the development or test tables respectively. The latter also completes the running of all test files.

Dependencies to install with their minimum versions to run:
- express (4.18.2)
- dotenv (16.0.0)
- pg (8.7.3)
- pg-format (1.0.4)

Install by running ```npm install <dependency-name>``` for each dependency
