import React from 'react'
import Signup from '../src/components/Signup'
import Login from '../src/components/Login'
import Dashboard from '../src/components/Dashboard'
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
    </>
  )
}

export default App