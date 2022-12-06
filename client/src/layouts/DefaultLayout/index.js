import { Navigate, Outlet, Link } from "react-router-dom"
import SideBar from "../../components/SideBar"
export default function DefaultLayout({isAllowed}) {
    if (!isAllowed) {
        return  <Navigate to="/login" replace />
    }
    return (
        <>
            <SideBar />
            <div className="admin-navbar">
                    <ul>
                        <li>
                            <Link to="/">Bản đồ</Link>
                        </li>
                    </ul>
                </div>
            <div className="wrapper">
                <Outlet />
            </div>
        </>
    )
}
