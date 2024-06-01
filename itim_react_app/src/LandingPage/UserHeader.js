import { useState } from "react";
import useAuth from '../Authentication/AdminAuth';

const UserHeader = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        login(email, password);
    }

    return (
        <div className="header">
            <h1>חיפוש מקוואות נשים</h1>,
            <div className="admin_login">
                <input id="email_login" placeholder="Email..."
                    onChange={(e) => setEmail(e.target.value)}></input>
                <input id="password_login" placeholder="Password..." type='password'
                    onChange={(e) => setPassword(e.target.value)}></input>
                <button id="button_login" onClick={handleLogin}>SIGN IN</button>
            </div>,
            {/* <img src="itimlogo.png" className="logo" /> */}
        </div>

    );

};

export { UserHeader }
