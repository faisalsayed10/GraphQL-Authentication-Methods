const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    first_name: String
    last_name: String
    username: String
    email: String!
  }

  type Query {
    user: User!
    protected: String
  }

  type Mutation {
    addBook(
      title: String!
      cover_image_url: String!
      average_rating: Float!
      authorId: Int!
    ): String!
  }
`;

module.exports = typeDefs;
