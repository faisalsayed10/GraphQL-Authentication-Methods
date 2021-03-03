const { User } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      // make sure user is logged in

      if (!user) {
        throw new Error("You are not authenticated!");
      }

      console.log(user);

      // user is authenticated and returning the user from the database (change this line according the db you use.)
      return await User.findByPk(user.id);
    },
  },

  Mutation: {
    // Handle user signup
    async signup(_, { username, email, password }) {

      // (change this line according the db you use.)
      const user = await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });

      // return json web token
      return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
    },

    // Handles user login
    async login(_, { email, password }) {
      // (change this line according the db you use.)
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Incorrect password");
      }

      // return json web token
      return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    },
  },
};

module.exports = resolvers;
