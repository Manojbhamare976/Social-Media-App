import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../api/axiosUserClient.js";
import { useNavigate } from "react-router-dom";
import "./Search.css";
export default function SearchUser() {
  const navigate = useNavigate();
  let [searchData, setSearchData] = useState({ data: "" });
  let [result, setResult] = useState(undefined);
  let [error, setError] = useState(null);
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
      if (res.data.user) {
        setResult(res.data.user);
      } else {
        setResult(null);
      }
      setError(null);
    } catch (err) {
      console.log(err.message);
      setResult(undefined);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div>
      <form className="search-form">
        <input
          className="poppins-medium"
          name="data"
          type="text"
          placeholder="search user"
          value={searchData.data}
          onChange={(e) =>
            setSearchData({ ...searchData, [e.target.name]: e.target.value })
          }
        />
        <button onClick={getResult}>
          <Search />
        </button>
      </form>
      {result === undefined ? null : result ? (
        <div
          onClick={() =>
            navigate({
              pathname: "/userprofile",
              search: `?userId=${result._id}`,
            })
          }
          className="search-result poppins-medium"
        >
          <img src={result.profilePic} alt="no profile image" />
          <div className="user-details">
            <p>{result.username}</p>
            <p className="user-bio noto-serif">{result.bio}</p>
          </div>
        </div>
      ) : (
        <div className="user-not-found poppins-medium">
          {" "}
          <p>User not found</p>
        </div>
      )}
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
}
