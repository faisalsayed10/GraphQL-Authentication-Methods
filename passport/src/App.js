import { useQuery } from "@apollo/react-hooks";
import Login from "./Login";
import LoginWithFacebook from "./LoginWithFacebook";
import Logout from "./Logout";
import { CURRENT_USER_QUERY } from "./queries";
import SignupWithCredentials from "./Signup";

const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  const isLoggedIn = !!data.currentUser;
  if (isLoggedIn) {
    const { id, firstName, lastName, email } = data.currentUser;
    return (
      <>
        {id}
        <br />
        {firstName} {lastName}
        <br />
        {email}
        <br />
        <Logout />
      </>
    );
  }
  // SIGNUP AND LOGIN GO HERE
  return (
    <>
      <Login />
      <LoginWithFacebook />
      <SignupWithCredentials />
    </>
  );
};
export default App;
