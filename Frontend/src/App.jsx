import Sidebar from "./homepage-components/Sidebar.jsx";
import Login from "./userAuth/Login.jsx";
import Signup from "./userAuth/Signup.jsx";
import Logout from "./userAuth/Logout.jsx";

function App() {
  return (
    <>
      <Signup />
      <Login />
      <Logout />
      <Sidebar />
    </>
  );
}

export default App;
