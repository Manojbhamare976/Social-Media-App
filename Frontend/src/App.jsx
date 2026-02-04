import "./App.css";
import Signup from "./userAuth/Signup.jsx";
import Login from "./userAuth/Login.jsx";
import Logout from "./userAuth/Logout.jsx";
import Homepage from "./pages/Homepage.jsx";
import CreateComment from "./pages/CreateComment.jsx";

function App() {
  return (
    <>
      <Signup />
      <Login />
      <Logout />
      <Homepage />
      <CreateComment postId={"697b8dfa5e3494282d76eb3e"} />
    </>
  );
}

export default App;
