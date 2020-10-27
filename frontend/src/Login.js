import React from 'react'
import MenuIcon from '@material-ui/icons/Menu';
import './Header.css'
import { IconButton } from '@material-ui/core';

const Login = () => {
    return (
        <div className="header">
            <a>
            <img className="header__logo" src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt="" /><span className="tinder">tinder</span>
            </a>

        <IconButton>
            <MenuIcon fontSize="large" className="header__icon" />
        </IconButton>
    </div>
    )
}

export default Login
