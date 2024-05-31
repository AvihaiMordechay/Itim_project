import "./AdminPage.css"; // Import CSS file
import { signOut } from "firebase/auth";
import { myAuth } from "../Firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const AdminPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignOut = () => {

    signOut(myAuth).then(() => {
      navigate('/');
    })
  };


  return (
    <div className="admin-page">
      <div className="header">
        <h1>Admin Page</h1>
        <button className="return-button" onClick={handleSignOut}>Return</button>
      </div>
      <div className="body">
        <div className="table-container">
          <table className="table">
          </table>
        </div>
      </div>
    </div>
  );
};

export { AdminPage };
