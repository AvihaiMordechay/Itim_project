import { useState } from "react";
import useAuth from '../Authentication/AdminAuth';
import './UserHeader.css';
import { RiAdminLine } from "react-icons/ri";

const UserHeader = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);

    const handleLogin = () => {
        login(email, password);
    }

    return (
        <div className="header-container">
            <div className="header">
                <div className="admin-icon" onClick={() => setIsAdminPopupOpen(true)}>
                    <RiAdminLine size={30} /> {/* Adjusted size */}
                </div>
                <h1>חיפוש מקוואות נשים</h1>
                <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Logo" />
            </div>

            {isAdminPopupOpen && (
                <div className="admin-popup">
                    <div className="admin-popup-content">
                        <div className="admin-popup-header">
                            <h2>Admin Login</h2>
                            <button className="close-button" onClick={() => setIsAdminPopupOpen(false)} type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>
                        <div className="admin-popup-body">
                            <input className="admin-input" id="email_login" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} dir="ltr"></input>
                            <input className="admin-input" id="password_login" type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} dir="ltr"></input>
                            <button className="admin-button" id="button_login" onClick={handleLogin}>SIGN IN</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { UserHeader };