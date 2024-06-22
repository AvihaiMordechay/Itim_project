import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AdminAddMikve } from "./AdminAddMikve"
import { AdminMikvesList } from "./AdminMikvesList";
const AdminPage = () => {

  return (
    <div className="admin-page">
      < AdminHeader />
      <div className="admin-main-content">
        <AdminAddMikve />
        <AdminMikvesList />
      </div>
    </div>
  );
};

export { AdminPage };
