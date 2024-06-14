import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AddMikve } from "./AddMikve"
const AdminPage = () => {

  return (
    <div className="admin-page">
      < AdminHeader />
      <div className="admin-main-content">
        <AddMikve />
      </div>
    </div>
  );
};

export { AdminPage };
