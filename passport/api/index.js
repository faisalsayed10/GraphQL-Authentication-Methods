import express from "express";
import session from "express-session";
import { v4 } from "uuid";
import passport from "passport";
import { getUsers, addUser } from "./User.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { ApolloServer } from "apollo-server-express";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport"; // we will make use of the GraphQL passport library which makes authentication much easier and is completely overkill!
import FacebookStrategy from "passport-facebook";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = 4000;
const SESSION_SECRET = "putyoursessionsecrethere"; // it is recommended to put it in the .env file.

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const users = getUsers();
  const matchingUser = users.find((user) => user.id === id);
  done(null, matchingUser);
});

const facebookOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID, // go to developers.facebook.com, create a new app for yourself and put the credentials in the .env file
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/facebook/callback",
  profileFields: ["id", "email", "first_name", "last_name"],
};

const facebookCallback = (accessToken, refreshToken, profile, done) => {
  const users = getUsers();
  const matchingUser = users.find((user) => user.facebookId === profile.id);

  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const newUser = {
    id: v4(),
    facebookId: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  };
  users.push(newUser);
  done(null, newUser);
};

passport.use(
  new GraphQLLocalStrategy((email, password, done) => {
    const users = getUsers();
    const matchingUser = users.find(
      (user) => email === user.email && password === user.password
    );
    const error = matchingUser ? null : new Error("no matching user");
    done(error, matchingUser);
  })
);

passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

app.use(
  session({
    genid: (req) => v4(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } <-- uncomment this if you are switching to production
  })
);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000",
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res, addUser, getUsers }),
});

server.applyMiddleware({ app, cors: false });

app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
