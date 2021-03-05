const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
require("dotenv").config();

const app = express();
const PORT = 4000;

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const token = req.headers.authorization;
      const user = new Promise((resolve, reject) => {
        jwt.verify(token, getKey, options, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded.email);
        });
      });

      return { user };
    } catch {}
  },
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/graphql`);
});
