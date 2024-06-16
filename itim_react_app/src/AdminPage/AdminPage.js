import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AddMikve } from "./AddMikve"
import { AdminMikvesList } from "./AdminMikvesList";
const AdminPage = () => {

  return (
    <div className="admin-page">
      < AdminHeader />
      <div className="admin-main-content">
        <AddMikve />
        <AdminMikvesList />
      </div>
    </div>
  );
};

export { AdminPage };
