# grad-program-team-8

Blog web app for Team 8 displaying security principles.

## How to start up the server

Navigate to the docker directory and run `docker-compose build`, followed by `docker-compose-up` to start the application.

## Implementation

### Back End and Front End

This application consists of a back end that was implemented with Express.js and a front end that was implemented with vanilla html, css and JavaScript in addition to using Bootstrap for styling.

### Database

The server saves data using a MySQL database which is hosted in a docker container. This database has 4 tables: Users, Blogs, Posts, and Subscriptions.
The Users table is used to store information about a user (name, surname, email and the person's hashed password as well as the corresponding random salt that was used to generate the password hash). Password hashing was done using the bcrypt library The express server communicates with this database using the sequelize ORM library.

### Authentication

For authentication JWT tokens are used. The JWT token that the server generates consists of the id of the user, the user's email and his/her name. All routes on the server that need to be authenticated are authenticated using a middleware which verifies the JWK access token is valid.

### Authorization

The server makes sure that each operation request made by an authenticated user is actually permitted to that user.
