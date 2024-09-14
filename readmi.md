# To-Do Web Application Structure

## Libraries/Dependencies
- express: Web application framework
- mongoose: MongoDB object modeling tool
- ejs: Templating engine
- express-session: Session middleware for Express
- bcrypt: Password hashing
- connect-mongo: MongoDB session store
- dotenv: Environment variable management

## Routes
1. Authentication Routes (auth.js):
   - GET /login - Display login form
   - POST /login - Process login
   - GET /register - Display registration form
   - POST /register - Process registration
   - GET /logout - Log out user

2. List Routes (lists.js):
   - GET /lists - Display all lists
   - GET /lists/create - Display create list form
   - POST /lists/create - Process list creation
   - GET /lists/:id - Display specific list
   - GET /lists/:id/edit - Display edit list form
   - PUT /lists/:id - Process list update
   - DELETE /lists/:id - Delete a list


3. Todo Routes (todos.js):
   - POST /lists/:listId/todos - Add a new todo
   - PUT /lists/:listId/todos/:todoId - Update a todo
   - DELETE /lists/:listId/todos/:todoId - Delete a todo

## HTML Pages (EJS templates)
1. home.ejs - Landing page
2. login.ejs - Login form
3. register.ejs - Registration form
4. lists.ejs - Display all lists and create new list form
5. todos.ejs - Display todos for a specific list, add/edit/delete todos

## Models
1. User.js - User schema (username, email, password)
2. List.js - List schema (title, user reference)
3. Todo.js - Todo schema (content, completed status, list reference)

## Middleware
- auth.js - Authentication middleware to protect routes
