import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AdminContent } from "./AdminContent";
const AdminPage = () => {

  return (
    <div className="admin-page">
      < AdminHeader />
      < AdminContent />
    </div>
  );
};

export { AdminPage };
