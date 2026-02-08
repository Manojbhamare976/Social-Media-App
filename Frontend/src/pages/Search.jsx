import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../api/axiosUserClient.js";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
  const navigate = useNavigate();
  let [searchData, setSearchData] = useState({ data: "" });
  let [result, setResult] = useState(null);

  async function getResult(e) {
    e.preventDefault();
    try {
      if (searchData.data === "") {
        return console.log("search text empty");
      }
      let res = await api.get(`/userprofile/find/user`, {
        params: {
          username: searchData.data,
        },
      });
      console.log(res.data.user);
      setResult(res.data.user);
      console.log(result);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <form>
        <input
          name="data"
          type="text"
          placeholder="search something"
          value={searchData.data}
          onChange={(e) =>
            setSearchData({ ...searchData, [e.target.name]: e.target.value })
          }
        />
        <button onClick={getResult}>
          <Search />
        </button>
      </form>
      {result && (
        <div>
          <img src={result.profilePic} alt="no profile image" />
          <p>{result.username}</p>
          <p>{result.bio}</p>
        </div>
      )}
    </>
  );
}
