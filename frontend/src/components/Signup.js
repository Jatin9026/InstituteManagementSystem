import React, { useState } from "react";
import "../components/style.css";
import axios from 'axios';

const Signup = () => {
  const [fullName,setfullName]=useState("")
  const [email,setEmail]=useState("")
  const [phone,setPhone]=useState("")
  const [password,setPassword]=useState("")
  const [image,setImage]=useState(null)
  const [imageUrl,setImageUrl]=useState(null)
  const submitHandler=(event)=>{
    event.preventDefault();
    const formData = new FormData();
formData.append('fullName',fullName);
formData.append('email',email);
formData.append('phone',phone);
formData.append('password',password);
formData.append('image',image);
axios.post("http://localhost:4200/user/signup",formData).then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})
  }
  const fileHandler=(e)=>{
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className="signup-wrapper"> 
      <div className="signup-box">
        <div className="signup-left">
          <img alt="instute image" className="signup-left-image" src={require("../assets/signupLogo.png")}/>
        </div>
        <div className="signup-right">
          <h1>
            Create Your Account
          </h1>
          <form onSubmit={submitHandler}>
           <input type="text" placeholder="Institute Name" value={fullName} onChange={(e)=>{setfullName(e.target.value)}}/>
          <input type="mail" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
          <input type="number" placeholder="phone" onChange={(e)=>{setPhone(e.target.value)}}/>
          <input type="password" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
          <input type="file" placeholder="choose-file" onChange={fileHandler} />
          <img  alt="logo" src={imageUrl}/>
          <button type="submit" >Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
