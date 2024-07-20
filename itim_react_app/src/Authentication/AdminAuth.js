import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { myAuth } from '../Firebase';

// useAuth.js
// Custom hook for authentication operations. Provides `login` and `logout` functions using Firebase authentication.
// Redirects users to specific routes upon login or logout.
const useAuth = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const login = async (email, password) => {
        if (email === "" || password === "") {
            return { success: false, error: "אנא מלא את כל השדות" };
        }
        try {
            await signInWithEmailAndPassword(myAuth, email, password);
            navigate('/Admin');
            return { success: true };
        }
        catch (error) {
            return { success: false, error: "אימייל או סיסמא לא נכונים" };
        }
    };

    const logout = () => {
        signOut(myAuth).then(() => {
            navigate('/');
        });
    };

    return { login, logout };
};

export default useAuth;
