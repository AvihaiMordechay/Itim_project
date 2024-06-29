import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { myAuth } from '../Firebase';

const useAuth = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const login = async (email, password) => {
        if (email === "" || password === "") {
            alert("אנא מלא את כל השדות")
            return;
        }
        try {
            await signInWithEmailAndPassword(myAuth, email, password);
            navigate('/Admin');
        }
        catch (error) {
            alert("אחד מהשדות שהכנסת אינם נכונים")
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
