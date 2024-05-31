import './LandingPage.css';
import { UserSearchForm } from './UserSearchForm';
import { UserMikvesList } from './UserMikvesList';
import { Map } from './Map';
import { myAuth } from '../Firebase';
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook


const LandingPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate hook

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(myAuth, email, password);
            navigate('/Admin');
        }
        catch (error) {
            //TODO: add popup; login failed
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        }
    };

    return (
        <div className="landing-page">
            <div className="header">
                <h1>חיפוש מקוואות נשים</h1>
                <div className="admin_login">
                    <input id="email_login" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}></input>
                    <input id="password_login" placeholder="Password..." onChange={(e) => setPassword(e.target.value)}></input>
                    <button id="button_login" onClick={signIn}>SIGN IN</button>
                </div>
                {/* <img src="itimlogo.png" className="logo" /> */}
            </div>

            <div className="main-content">
                <UserSearchForm />
                <div className="content">
                    <Map />
                    <UserMikvesList />
                </div>
            </div>
        </div>
    );
};

export { LandingPage };
