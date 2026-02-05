import "./App.css";
import Homepage from "./pages/Homepage.jsx";
import CreateComment from "./pages/CreateComment.jsx";
import CreatePost from "./pages/CreatePost.jsx";

function App() {
  return (
    <>
      <CreatePost />
      <Homepage />
      <CreateComment postId={"697b8dfa5e3494282d76eb3e"} />
    </>
  );
}

export default App;
