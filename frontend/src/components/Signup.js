import React, { useState } from "react";
import "../components/style.css";
import {toast} from "react-toastify"
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import {useNavigate,Link}  from 'react-router-dom'
const Signup = () => {
  const [fullName,setfullName]=useState("")
  const [email,setEmail]=useState("")
  const [phone,setPhone]=useState("")
  const [password,setPassword]=useState("")
  const [image,setImage]=useState(null)
  const [imageUrl,setImageUrl]=useState(null)
  const [isLoader,setisLoader]=useState(false)
  const navigate = useNavigate();
  const submitHandler=(event)=>{
    event.preventDefault();
    navigate("/login")
    toast.success("Account Created Succesfully")
    setisLoader(true);
    const formData = new FormData();
formData.append('fullName',fullName);
formData.append('email',email);
formData.append('phone',phone);
formData.append('password',password);
formData.append('image',image);
console.log([...formData.entries()])
axios.post("http://localhost:4200/user/signup",formData).then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
  toast.error("something is worong")
})
  }
  const fileHandler = (e) => {
    const file = e.target.files?.[0];
  
    if (file && file instanceof Blob) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl); 
      setImage(file)
    } else {
      console.error("Invalid file type passed to createObjectURL", file);
    }
  };
  
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
           <input  required type="text" placeholder="Institute Name" value={fullName} onChange={(e)=>{setfullName(e.target.value)}}/>
          <input required  type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
          <input required  type="number" placeholder="phone" onChange={(e)=>{setPhone(e.target.value)}}/>
          <input  required type="password" placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
          <input required  type="file" placeholder="choose-file" onChange={fileHandler} />
         {imageUrl && <img  alt="logo" src={imageUrl}/>} 
       {isLoader ? (<button type="submit" ><ClipLoader/></button>):(<button type="submit" >Sigup</button>)}
       <Link to="/login">Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
