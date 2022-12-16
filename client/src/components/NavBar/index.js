import { Container, Navbar, Nav } from 'react-bootstrap';
import { useSelector } from  "react-redux"
import { Link } from "react-router-dom"

function MyNavBar() {

  const user = useSelector((state) => state.user)

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
           {(user && user.userId && user.role > 0) ? <Link to="/symbol">Quản lý</Link> : <Link to="/login">Đăng nhập</Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavBar;