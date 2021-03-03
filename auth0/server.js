// Example 2: This example will contain both, the back-end and the front-end. We'll build a simple todo app for that.
// To begin, simply log on to Auth0 and create
// a new API with the values: Identifier: http://localhost:4000 and Signing Algo: RS256.
// Next create a .env file and add AUTH0_ISSUER and AUTH0_AUDIENCE with the respective values you get after creating the API.
// Next, you can create a front-end and integrate the auth as shown! (refer ./auth0-frontend/)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./data/schema");
const resolvers = require('./data/resolvers')
const jwt = require("express-jwt");
var jwks = require("jwks-rsa");
require("dotenv").config();

const PORT = 4000;

// create our express app
const app = express();

// enable CORS
app.use(cors());

// auth middleware
const auth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

app.use(bodyParser.json(), auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req, res) => ({ user: req.user }),
});

server.applyMiddleware({ app })

app.listen(PORT, () => {
  console.log(`The GraphQL server is running on http://localhost:${PORT}/graphql`);
});
