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

i decided to handle the tag insertion into a task using a PATCH method to modify only specific fields of the DB row, the method uses "INSERT IGNORE" in the query to skip the duplicate entries.
The idea was to combine the CREATE and the PATCH methods in the task creation form.

that approach forced me to build CRUD operation methods for the tags too.

