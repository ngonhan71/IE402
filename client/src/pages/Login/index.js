import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import userApi from "../../api/userApi"
import { login } from "../../redux/actions/user"

export default function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async(e) => {
      e.preventDefault()
      try {
        const { data, accessToken, error } = await userApi.login({username, password})
        if (error) {
          setError(error)
          return
        }
        const { name, userId, role } = data
        if (role === 0) {
          setError("Bạn không có quyền truy cập hệ thống!!")
          return
        }
        localStorage.setItem("accessToken", accessToken)
        dispatch(login({ name, userId, username, role }))
        navigate({ pathname: '/symbol' })
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div className="login-page">
        <Row>
          <Col xl={4}>
            <div className="login-wrapper">
              <p className="title">ĐĂNG NHẬP HỆ THỐNG</p>
              {error && <p className="error-msg my-2">{error}</p>}
              <form onSubmit={handleLogin}>
                <Row>
                  <Col xl={12}>
                    <input required type="text" className="form-control" placeholder="Tài khoản" 
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <input required type="password" className="form-control" placeholder="Mật khẩu"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <Button type="submit" variant="danger">Đăng nhập</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    )
}