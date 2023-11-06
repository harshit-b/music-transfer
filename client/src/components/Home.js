//Home Page where all playlists of various streaming platforms can be populated 

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Spotify from "./Spotify"
import AmazonMusic from "./AmazonMusic";
import Youtube from "./Youtube";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const[userId, setUserId] = useState(null);
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status, user, userId } = data;
      setUserId(userId);
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };
  
  return (
    <div style={{backgroundColor: 'black'}}>
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username} </span>
        </h4>
        {/* Spotify Component */}
        <div className="music_apps">
          <Spotify userId={userId}/>
          {/* Add More Components like spotify for other music apps  */}
          {/*<AmazonMusic userId={userId}/>*/}
          <Youtube userId={userId} />
        </div>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;