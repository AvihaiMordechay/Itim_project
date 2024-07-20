import { useState } from "react";
import useAuth from '../Authentication/AdminAuth';
import './UserHeader.css';
import { RiAdminLine } from "react-icons/ri";

/**
 * UserHeader Component
 * 
 * This component renders the header of the user interface, including the title,
 * logo, and admin login functionality.
 */
const UserHeader = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);
    const [loginError, setLoginError] = useState("");

    /**
     * Handles the login process
     */
    const handleLogin = async () => {
        const result = await login(email, password);
        if (!result.success) {
            setLoginError(result.error);
        }
    }

    /**
     * Closes the admin login popup and resets related states
     */
    const handleClosePopup = () => {
        setIsAdminPopupOpen(false);
        setLoginError(""); // Clear the error message
        setEmail(""); // Clear the email input
        setPassword(""); // Clear the password input
    }

    /**
     * Opens the admin login popup
     */
    const handleOpenPopup = () => {
        setIsAdminPopupOpen(true);
        setLoginError(""); // Clear any previous error message
    }

    /**
     * Handles key press events in the login inputs
     * @param {Event} e - The key press event
     */
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    return (
        <div className="header-container">
            <div className="header">
                <div className="admin-icon" onClick={handleOpenPopup}>
                    <RiAdminLine size={30} />
                </div>
                <div className="header-wrapper">
                    <h1>מקוואות נשים</h1>
                    <a href="https://www.itim.org.il/" target="_blank" rel="noopener noreferrer" className="logo-link">
                        <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Logo" />
                    </a>                
                </div>
            </div>

            {isAdminPopupOpen && (
                <div className="admin-popup">
                    <div className="admin-popup-content">
                        <div className="admin-popup-header">
                            <button className="close-button" onClick={handleClosePopup} type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                            <h2>התחברות לאזור ניהול</h2>
                        </div>
                        <div className="admin-popup-body">
                            <input
                                className="admin-input"
                                id="email_login"
                                placeholder="email..."
                                onChange={(e) => setEmail(e.target.value)}
                                dir="ltr"
                                onKeyPress={handleKeyPress}
                            />
                            <input
                                className="admin-input"
                                id="password_login"
                                type="password"
                                placeholder="password..."
                                onChange={(e) => setPassword(e.target.value)}
                                dir="ltr"
                                onKeyPress={handleKeyPress}
                            />
                            {loginError && <p className="login-error">{loginError}</p>}
                            <button className="admin-button" id="button_login" onClick={handleLogin}>התחבר</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { UserHeader };
