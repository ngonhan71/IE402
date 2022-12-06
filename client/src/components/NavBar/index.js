import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom"

function MyNavBar() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
           <Link to="/symbol">Quản lý</Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavBar;