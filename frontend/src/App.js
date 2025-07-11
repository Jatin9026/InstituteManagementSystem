import React from 'react'
import Signup from '../src/components/Signup'
import Login from '../src/components/Login'
import Dashboard from '../src/components/Dashboard'
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import AddCourses from './components/AddCourses'
import Student from './components/Student'
import AddStudent from './components/AddStudent'
import CollectFee from './components/CollectFee'
import Payment from './components/Payment'
import Courses from './components/Courses'
const App = () => {
  const myRouter=createBrowserRouter([
    {path:'',Component:Signup},
    {path:'login',Component:Login},
    {path:'sighup',Component:Signup},
    {path:'dashboard',Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'add-course',Component:AddCourses},
      {path:'all-student',Component:Student},
      {path:'add-student',Component:AddStudent},
      {paht:'collect-fee',Component:CollectFee},
      {path:'payment-history',Component:Payment},
      {path:'all-course',Component:Courses}
    ]}
  ])
  return (
    <>
<RouterProvider router={myRouter}/>
<ToastContainer/>
    </>
  )
}

export default App