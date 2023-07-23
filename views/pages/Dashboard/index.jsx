import { useState, useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Man from "../../../assets/images/Dashboard/man.svg";
import Woman from "../../../assets/images/Dashboard/woman.svg";
import { SingleProgress } from "../../../components/shared/SingleProgress";
import { BigCalendar } from "../Holiday";
import "./style.scss";

const Dashboard = () => {
    return (
        <>
            <div className="pt-3 pb-5 overflow-auto" style={{ height: "calc(100vh - 100px)" }}>
                <Container className="h-100" fluid>
                    <Row className="h-100">
                        <Col sm={12} md={6}>
                            <div className="h-100">
                                <div className="totalStudentsAndFaculty ShadowAndRadius d-flex align-items-center d-flex justify-content-between text-center">
                                    <img src={Man} />
                                    <p className="p-0 m-0 fs-5">
                                        Students
                                        <br />
                                        <span className="fs-6 fw-bold">1,117</span>
                                    </p>
                                    <p className="p-0 m-0 fs-5">
                                        Male
                                        <br />
                                        <span className="fs-6 fw-bold">0</span>
                                    </p>
                                    <p className="p-0 m-0 fs-5">
                                        Female
                                        <br />
                                        <span className="fs-6 fw-bold">0</span>
                                    </p>
                                </div>
                                <div className="totalStudentsAndFaculty ShadowAndRadius d-flex align-items-center d-flex d-flex justify-content-between text-center mt-4">
                                    <img src={Woman} />
                                    <p className="p-0 m-0 fs-5">
                                        Students
                                        <br />
                                        <span className="fs-6 fw-bold">1,117</span>
                                    </p>
                                    <p className="p-0 m-0 fs-5">
                                        Male
                                        <br />
                                        <span className="fs-6 fw-bold">0</span>
                                    </p>
                                    <p className="p-0 m-0 fs-5">
                                        Female
                                        <br />
                                        <span className="fs-6 fw-bold">0</span>
                                    </p>
                                </div>
                                <div className="mt-3">
                                    <BigCalendar />
                                </div>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className="mt-4 mt-md-0">
                            <div className="h-100">
                                <div className="ShadowAndRadius px-3 py-3">
                                    <p className="p-0 m-0 fw-bold fs-6">Class Progress</p>
                                    <div className="mt-2 OverflowStyle overflow-y-scroll ms-3 pe-3" style={{ height: "calc(50vh - 150px)" }}>
                                        {prgressArr?.map((item, idx) => {
                                            return <SingleProgress item={item} key={idx} />;
                                        })}
                                    </div>
                                </div>
                                <div className="ShadowAndRadius px-3 py-3 mt-4">
                                    <p className="p-0 m-0 fw-bold fs-6">Noticeboard</p>
                                    <div className="mt-2 OverflowStyle overflow-y-scroll pe-3" style={{ height: "calc(50vh - 125px)" }}>
                                        <div className="d-flex justify-content-between align-items-center NoticeboardStyle mt-2">
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 NoticeboardNumberBadge fw-bold fs-2">13</p>
                                                <p className="p-0 m-0 ms-4">
                                                    <span className="fs-6 fw-bold"> {"Life Contingency Tutorials"}</span>
                                                    <br />
                                                    <span className="text-muted fw-bold">
                                                        <span>{"8th - 10th July 2021"}</span>
                                                        <span className="mx-1 fs-6" style={{ color: "#0077ff" }}>
                                                            &#8226;
                                                        </span>
                                                        <span>{"8 A.M - 9 A.M"}</span>
                                                        <br />
                                                        <span>{"Edulog Tutorial College, Blk 56, Lagos State."}</span>
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="p-0 m-0 fs-1">&#8250;</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center NoticeboardStyle mt-2">
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 NoticeboardNumberBadge fw-bold fs-2">13</p>
                                                <p className="p-0 m-0 ms-4">
                                                    <span className="fs-6 fw-bold"> {"Life Contingency Tutorials"}</span>
                                                    <br />
                                                    <span className="text-muted fw-bold">
                                                        <span>{"8th - 10th July 2021"}</span>
                                                        <span className="mx-1 fs-6" style={{ color: "#0077ff" }}>
                                                            &#8226;
                                                        </span>
                                                        <span>{"8 A.M - 9 A.M"}</span>
                                                        <br />
                                                        <span>{"Edulog Tutorial College, Blk 56, Lagos State."}</span>
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="p-0 m-0 fs-1">&#8250;</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center NoticeboardStyle mt-2">
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 NoticeboardNumberBadge fw-bold fs-2">13</p>
                                                <p className="p-0 m-0 ms-4">
                                                    <span className="fs-6 fw-bold"> {"Life Contingency Tutorials"}</span>
                                                    <br />
                                                    <span className="text-muted fw-bold">
                                                        <span>{"8th - 10th July 2021"}</span>
                                                        <span className="mx-1 fs-6" style={{ color: "#0077ff" }}>
                                                            &#8226;
                                                        </span>
                                                        <span>{"8 A.M - 9 A.M"}</span>
                                                        <br />
                                                        <span>{"Edulog Tutorial College, Blk 56, Lagos State."}</span>
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="p-0 m-0 fs-1">&#8250;</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center NoticeboardStyle mt-2">
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 NoticeboardNumberBadge fw-bold fs-2">13</p>
                                                <p className="p-0 m-0 ms-4">
                                                    <span className="fs-6 fw-bold"> {"Life Contingency Tutorials"}</span>
                                                    <br />
                                                    <span className="text-muted fw-bold">
                                                        <span>{"8th - 10th July 2021"}</span>
                                                        <span className="mx-1 fs-6" style={{ color: "#0077ff" }}>
                                                            &#8226;
                                                        </span>
                                                        <span>{"8 A.M - 9 A.M"}</span>
                                                        <br />
                                                        <span>{"Edulog Tutorial College, Blk 56, Lagos State."}</span>
                                                    </span>
                                                </p>
                                            </div>
                                            <p className="p-0 m-0 fs-1">&#8250;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Dashboard;

const prgressArr = [
    { class: "A", totalRegistered: "78", percent: 78 },
    { class: "A", totalRegistered: "36", percent: 36 },
    { class: "C", totalRegistered: "12", percent: 12 },
    { class: "A", totalRegistered: "23", percent: 23 },
    { class: "B", totalRegistered: "34", percent: 34 },
    { class: "D", totalRegistered: "45", percent: 45 },
    { class: "A", totalRegistered: "56", percent: 56 },
    { class: "A", totalRegistered: "67", percent: 67 },
    { class: "B", totalRegistered: "78", percent: 78 },
    { class: "A", totalRegistered: "89", percent: 89 },
    { class: "C", totalRegistered: "99", percent: 90 },
    { class: "A", totalRegistered: "100", percent: 100 },
];
