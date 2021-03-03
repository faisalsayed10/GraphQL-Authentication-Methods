// Example 1: Express JWT
// In this example, a JWT token is returned when the user logs in or signs up. You'll need to store that token
// in the front-end as an Authorization header. Eg: Authorization: Bearer {token}
// And when the `me` query gets called, it will return you the user after checking the Authorization headers.
// Note: If you want to test your schema before implementing the backend, use Postman / Insomnia to test it and add the authorization headers
// in the Headers section!

const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./data/schema");
const resolvers = require("./data/resolvers");
const jwt = require("express-jwt");
require("dotenv").config();

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  algorithms: ["sha1", "RS256", "HS256"],
});

// create our express app
const app = express();
const PORT = 4000;

// middlewares
app.use(bodyParser.json(), auth);

// creating the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Now as the user is being passed in the context, you can access it in your resolver functions and secure your queries!
  // Eg: mutationName/queryName: (parent, args, { user }) => if (!user) throw new Error("Not logged in")
  context: ({ req, res }) => ({ user: req.user }),
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/graphql`);
});
