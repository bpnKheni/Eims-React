import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, CloseButton, Col, Container, Navbar, Offcanvas, Row } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";

import "../../../views/styles/app.scss";
import Sidebar from "../../Sidebar";
import { useLocation } from "react-router-dom";
import manuIcon from "../../../assets/images/menu-bar-icon.svg"

const MainLayout = ({ children }) => {
    const { pathname } = useLocation();
    const [show, setShow] = useState(false);
    const handleToggle = () => setShow(!show);

    return (
        <Container fluid className="">
            <Row className="w-100 layout__wrapper">
                {pathname !== "/login" && (
                    <Col className="sidebar d-none d-xl-block overflow-hidden " xxl={2} xl={2} lg={2}>
                        <Sidebar show={show} handleClose={handleToggle} />
                    </Col>
                )}
                <Col className="screen_container">
                    {pathname !== "/login" && (
                        <Navbar sticky="top" className="nav__container">
                            <button  className="d-xl-none  bg-transparent border-0" onClick={handleToggle}>
                                <img src={manuIcon} className="" height={"50px"} width={"45px"} />
                            </button>
                            <h3 className="py-0 my-0 ms-3">Hello Admin</h3>
                        </Navbar>
                    )}
                    <div>{children}</div>
                </Col>
            </Row>
        </Container>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
