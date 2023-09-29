import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ToastContainerWrapper from "./ToastContainerWrapper";

// styling
import "../App.css"

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const {email, password, username} = inputValue;

  const handleOnChange = (e) => {
    const {name, value} = e.target;
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const handleError = (err) => 
    toast.error(err, {
      position: "bottom-left",
  });

  const handleSuccess = (msg) => 
    toast.success(msg, {
      position: "bottom-right",
  })
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(
        "http://localhost:4000/signup",
        {
          ...inputValue
        },
        {withCredentials: true}
      );
      const {success, message} = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/")
        }, 1000)
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error)
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    })
  }

  return (
    <div>
      <div className="form-comp cfb">
      <h1>Create an Account!</h1>
      <form className="sign-up-form cfb" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Username
          <br/>
          <input 
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </label>
        <label htmlFor="email">
          Email:
          <br/>
          <input 
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </label>
        <label htmlFor="password">
          Password:
          <br/>
          <input 
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </label>
        <br/>
        <button style={{backgroundColor: "black", color: "white" }} type="submit">
          Sign Up!
        </button>
      </form>
    </div>
    <ToastContainerWrapper />
  </div>
  );
};

export default Signup