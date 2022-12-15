import { useDispatch } from "react-redux"
import { Navigate, Outlet, Link } from "react-router-dom"
import SideBar from "../../components/SideBar"

import { logout } from "../../redux/actions/user"

export default function DefaultLayout({isAllowed}) {
    const dispatch = useDispatch()
    if (!isAllowed) {
        return  <Navigate to="/login" replace />
    }

    const handleLogout = () => {
        dispatch(logout())
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
          localStorage.removeItem('accessToken')
        }
        window.location.href = "/login"
      }

    return (
        <>
            <SideBar />
            <div className="admin-navbar">
                    <ul>
                        <li>
                            <Link to="/">Bản đồ</Link>
                        </li>
                        <li onClick={handleLogout} style={{marginLeft: "auto"}}>
                            <p>Đăng xuất</p>
                        </li>
                    </ul>
                </div>
            <div className="wrapper">
                <Outlet />
            </div>
        </>
    )
}
