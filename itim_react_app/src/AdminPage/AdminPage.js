import "./AdminPage.css"; // Import CSS file
import useAuth from '../Authentication/AdminAuth';
import { AdminHeader } from "./AdminHeader";
const AdminPage = () => {

  return (
    <div className="admin-page">
      <AdminHeader />
      <div className="user-main-content">
        <div className="table-container">
          <table className="table">
          </table>
        </div>
      </div>
    </div>
  );
};

export { AdminPage };
