import "./AdminHeader.css"
import useAuth from '../Authentication/AdminAuth';

const AdminHeader = () => {
    const { logout } = useAuth();

    return (
        <div className="header">
            <h1>דף אדמין</h1>
            <button className="return-button" onClick={logout}>חזרה</button>
        </div>
    )
}

export { AdminHeader }