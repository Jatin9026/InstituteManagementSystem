import React from 'react'
import "../components//style.css"
import { Link } from 'react-router-dom'

const SideNav = () => {
  return (
    <div className="navbar-container">
        <div className='brand-container'>
            <img src={require("../assets/logo192.png")}/>
            <div>
            <h1>infinity institue management</h1>
            <p>Manage your app</p>
            </div>
        </div>
        <div className='menu-container'>
        <Link to="/dashboard/home" className="menu-link">Home</Link>
        <Link to="/dashboard/all-course" className='menu-link'>All course</Link>
        <Link to="/dashboard/add-course" className='menu-link'>Add course </Link>
        <Link to="/dashboard/all-student" className='menu-link'>All student</Link>
        <Link to="/dashboard/add-student" className='menu-link'>Add Student</Link>
        <Link to="/dashboard/collect-fee" className='menu-link'>collect-fee</Link>
        <Link to="/dashboard/payment-history" className='menu-link'>Payment History</Link>
        </div>
        <div className='contact-us'>
            <p>Contact- us</p>
            <p>912312312312</p>
        </div>
    </div>
  )
}

export default SideNav