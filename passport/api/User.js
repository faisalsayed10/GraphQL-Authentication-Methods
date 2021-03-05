// MOCK USER DATA
const users = [
  {
    id: "1",
    firstName: "Maurice",
    lastName: "Moss",
    email: "maurice@moss.com",
    password: "abcdefg",
  },
  {
    id: "2",
    firstName: "Roy",
    lastName: "Trenneman",
    email: "roy@trenneman.com",
    password: "imroy",
  },
];

// FUNCTION FOR FETCHING ALL THE USERS
export const getUsers = () => users;

// FUNCTION FOR ADDING A NEW USER
export const addUser = (user) => users.push(user);
