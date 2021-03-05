import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNUP_MUTATION } from "./mutations";
import { CURRENT_USER_QUERY } from "./queries";
const user = {
  firstName: "Jen",
  lastName: "Barber",
  email: "jen@barber.com",
  password: "qwerty",
};
const Signup = () => {
  const [signup] = useMutation(SIGNUP_MUTATION, {
    update: (cache, { data: { signup } }) =>
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: signup.user },
      }),
  });
  return (
    <button onClick={() => signup({ variables: user })}>
      Signup as Jen Barber
    </button>
  );
};
export default Signup;
