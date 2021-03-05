import { v4 } from "uuid";

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
  },
  Mutation: {
    signup: async (_, { firstName, lastName, email, password }, context) => {
      const existingUsers = context.getUsers();
      const userWithEmailAlreadyExists = !!existingUsers.find(
        (user) => user.email === email
      );

      if (userWithEmailAlreadyExists) {
        throw new Error("User with email already exists");
      }
      const newUser = {
        id: v4(),
        firstName,
        lastName,
        email,
        password,
      };

      context.addUser(newUser);
      await context.login(newUser);
      return { user: newUser };
    },
    login: async (_, { email, password }, context) => {
      const { user } = await context.authenticate("graphql-local", {
        email,
        password,
      });
      await context.login(user);
      return { user };
    },
    logout: (parent, args, context) => context.logout(),
  },
};

export default resolvers;
