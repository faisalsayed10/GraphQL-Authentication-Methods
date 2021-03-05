import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }

  type AuthPayload {
    user: User
  }

  type Query {
    currentUser: User
  }
  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): AuthPayload
    logout: Boolean
  }
`;
export default typeDefs;
