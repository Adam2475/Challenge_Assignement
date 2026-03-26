# Technologies

- Angular (Frontend)
- Node.js (Backend)
- Express (Backend Framework)
- Pm2 (Dev Server)
- MySql (Database)
- Docker (Containerization)
- Postman (API testing)

# Pm2

Used for development server

# Postman

Used for API testing

# Challenges

i started by defining the main todo's for the project and ended up with a short list of macro tasks.

to implement the tags in a task as a list of strings i implemented
a many to many relationship handled by the task_tags junction table.

to get all the tasks with a specified tag i ran a JOIN query on the junction table to get all the fields where the ID is matching the passed parameter ID.

# Boot

## only development

- use docker compose up to start the mysql service
(check for active istances of mysql if not starting)
- seed the mysql database using the seeding script with docker exec
(documentation in database)
- run backend with npm install & npm run dev
- run frontend with npm start | ng serve