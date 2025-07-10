import React, { useState } from "react";
import "../components/style.css";
import {toast} from "react-toastify"
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import {Link, useNavigate}  from 'react-router-dom'
const Login = () => {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [isLoader,setisLoader]=useState(false)
  const navigate = useNavigate();
  const submitHandler=(event)=>{
    event.preventDefault();
    navigate("/dashboard")
    toast.success("Login Successfully")
    setisLoader(true);
axios.post("http://localhost:4200/user/login",{
  email:email,
  password:password
}).then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
  toast.error("something is worong")
})
  }
  
  return (
    <div className="signup-wrapper"> 
      <div className="signup-box">
        <div className="signup-left">
          <img alt="instute image" className="signup-left-image" src={require("../assets/signupLogo.png")}/>
        </div>
        <div className="signup-right">
          <h1>
            Enter Your Email and Password
          </h1>
          <form onSubmit={submitHandler}>
         
<input required  type="email" placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
          <input  required type="password" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
       {isLoader ? (<button type="submit" ><ClipLoader/></button>):(<button type="submit" >Login</button>)}
       <Link to="/">Create Your Account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
