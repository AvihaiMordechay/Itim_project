import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { myAuth } from '../Firebase';

const useAuth = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const login = async (email, password) => {
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

    const logout = () => {
        signOut(myAuth).then(() => {
            navigate('/');
        });
    };

    return { login, logout };
};

export default useAuth;
