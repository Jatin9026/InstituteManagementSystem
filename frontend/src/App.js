import React from 'react'
import Signup from '../src/components/Signup'
import Login from '../src/components/Login'
import Dashboard from '../src/components/Dashboard'
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
const App = () => {
  const myRouter=createBrowserRouter([
    {path:'',Component:Signup},
    {path:'login',Component:Login},
    {path:'sighup',Component:Signup},
    {path:'dashboard',Component:Dashboard}
  ])
  return (
    <>
<RouterProvider router={myRouter}/>
<ToastContainer/>
    </>
  )
}

export default App