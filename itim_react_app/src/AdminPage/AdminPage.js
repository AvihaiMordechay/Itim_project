import "./AdminPage.css"; // Import CSS file
import { AdminHeader } from "./AdminHeader";
import { AdminContent } from "./AdminContent";
const AdminPage = () => {

  return (
    <div className="admin-page">
      < AdminContent />
    </div>
  );
};

export { AdminPage };
