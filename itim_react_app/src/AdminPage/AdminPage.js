import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AdminAddMikve } from "./AdminAddMikve"
import { AdminMikvesList } from "./AdminMikvesList";
const AdminPage = () => {

  return (
    <div className="admin-page">
      <AdminHeader />
      <div className="user-main-content">

      </div>
    </div>
  );
};

export { AdminPage };
