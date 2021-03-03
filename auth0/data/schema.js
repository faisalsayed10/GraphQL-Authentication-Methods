const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Todo {
    userId: ID!
    title: String!
  }

  type Query {
    myTodos: [Todo]
  }

  type Mutation {
    addTodo(title: String!): Todo
  }
`;

