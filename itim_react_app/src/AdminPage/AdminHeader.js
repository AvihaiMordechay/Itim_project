import "./AdminHeader.css"
import useAuth from '../Authentication/AdminAuth';

const AdminHeader = () => {
    const { logout } = useAuth();

    return (
        <div className="header">
            <h1>Admin Page</h1>
            <button className="return-button" onClick={logout}>Return</button>
        </div>
    )
}

export { AdminHeader }