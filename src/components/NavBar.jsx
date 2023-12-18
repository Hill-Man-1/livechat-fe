import { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import medify from "../assets/medify.svg";
import "../index.css"
import Notifications from "./chat/Notifications";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="transparent" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center navbar-brand-custom">
                    <img src={medify} alt="Medify" style={{ height: "4rem", marginRight: "1rem" }}/>
                    <span style={{ fontSize: "1.75rem", fontWeight: "700" }}>HaloDog</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Notifications/>
                                <Nav.Link as={Link} to="/" className="text-warning nav-link-custom">
                                    Login as {user.firstname}
                                </Nav.Link>
                                <Nav.Link as={Link} to="/login" onClick={logoutUser} className="text-light nav-link-custom">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-dark nav-link-custom">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="text-dark nav-link-custom">
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
