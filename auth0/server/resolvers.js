const { AuthenticationError } = require("apollo-server-errors");

const resolvers = {
  Query: {
    user: async (_, __, { user }) => {
      try {
        const details = await user;
        return details;
      } catch {
        throw new AuthenticationError("You are not logged in!");
      }
    },
    protected: async (_, __, { user }) => {
      try {
        const details = await user;
        if (details) return "Congratulations! You just accessed a super secret route!";
      } catch {
        throw new AuthenticationError("You are not logged in!");
      }
    }
  }
}

module.exports = resolvers