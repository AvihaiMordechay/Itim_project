import "./AdminPage.css"; // Import CSS file
import useAuth from '../Authentication/AdminAuth';

const AdminPage = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-page">
      <div className="header">
        <h1>Admin Page</h1>
        <button className="return-button" onClick={logout}>Return</button>
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
