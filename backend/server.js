const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('./database.json');
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789';
const expiresIn = '1h';

// Create a token from a payload 
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token 
async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return err; // Return the error object if verification fails
  }
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  console.log('Checking if user is authenticated...');
  console.log('Email:', email, 'Password:', password);
  const user = userdb.users.find(user => user.email === email && user.password === password);
  console.log('User found:', user);
  return user !== undefined;
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const { email, password } = req.body;

  fs.readFile("./users.json", (err, data) => {
    if (err) {
      const status = 401;
      const message = err;
      res.status(status).json({ status, message });
      return;
    }

    // Get current users data
    var dataObj = JSON.parse(data.toString());

    // Check if email already exists
    const existingUser = dataObj.users.find(user => user.email === email);

    if (existingUser) {
      const status = 401;
      const message = 'Email already exists';
      res.status(status).json({ status, message });
      return;
    }

    // Generate new user id
    const userId = dataObj.users.length ? dataObj.users[dataObj.users.length - 1].id + 1 : 1;

    // Add new user to database
    dataObj.users.push({ id: userId, email, password });
    
    // Write updated data back to file
    fs.writeFile("./users.json", JSON.stringify(dataObj), (err) => {
      if (err) {
        const status = 401;
        const message = err;
        res.status(status).json({ status, message });
        return;
      }
      // Create token for new user
      const access_token = createToken({ email, password });
      console.log("Access Token:" + access_token);
      res.status(200).json({ access_token });
    });
  });
});

// Login to existing user
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const { email, password } = req.body;
  if (!isAuthenticated({ email, password })) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ email, password });
  console.log("Access Token:" + access_token);
  res.status(200).json({ access_token });
});

// Middleware to check for valid JWT token on protected routes
server.use(/^(?!\/auth).*$/, async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    const status = 401;
    const message = 'Error in authorization format';
    res.status(status).json({ status, message });
    return;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verifyTokenResult = await verifyToken(token);

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = 'Access token not provided or invalid';
      res.status(status).json({ status, message });
      return;
    }
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error: access_token is revoked or invalid';
    res.status(status).json({ status, message });
  }
});

// Example protected GET endpoint for '/users'
server.get('/users', (req, res) => {
  // Ensure only authenticated users can access this endpoint
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verify token
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Access user data securely (example using JSON Server router)
    const users = router.db.get('users').value();
    res.status(200).json(users);
  } catch (error) {
    // Handle token verification errors
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// Use JSON Server router for other endpoints
server.use(router);

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Auth API Server is running on port ${PORT}`);
});
