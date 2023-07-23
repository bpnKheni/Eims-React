import { Fragment } from "react";
import { Button } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import "./style.scss";

export const EnquiryHeader = ({ value, text }) => {
    return (
        <div className="enquiry-header-container">
            <h2 className="enquiry-title">{text}</h2>
            <p className="enquiry-number">
                Enquiry Number <span style={{ color: "#000000" }}>: {value}</span>
            </p>
        </div>
    );
};

export const FooterContainer = ({ text, currentPage, isLoading }) => {
    const totalPages = 3;

    return (
        <>
            <div className="footer">
                <div className="footer-container mt-5">
                    <Button type="submit" className="enquiry-button" disabled={isLoading}>
                        {text}
                    </Button>
                    <div style={{ marginTop: "20px" }} className="d-flex">
                        {[...Array(totalPages)].map((_, index) => (
                            <Fragment key={index}>
                                <Badge
                                    bg={currentPage === index + 1 ? "primary" : "light"}
                                    text={currentPage === index + 1 ? "light" : "primary"}
                                    className={`badge badge-rectangle align-self-center rounded align-self-center py-2 px-2 fw-5 fs-6 ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    {index + 1}
                                </Badge>
                                {index !== totalPages - 1 && (
                                    <span key={`separator-${index}`} className="separator align-self-center">
                                        <hr className="border border-1 border-primary" style={{ width: "10px" }} />
                                    </span>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
