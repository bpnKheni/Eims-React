import { yupResolver } from "@hookform/resolvers/yup";
import { Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../../views/styles/StudentRecords.scss";
import Img_placeholder from "../../../assets/images/StudentRecords/placeholder.svg";

const StudentCard = ({ studentData }) => {
    return (
        <div className="d-flex align-items-center p-2 card_style">
            <div className="text-center mx-auto">
                <div className="mx-auto " style={{ width: "67px", height: "74px" }}>
                    <img src={studentData?.photo || Img_placeholder} alt={"Profile Photo"} width={74} height={74} className="w-100 mx-auto d-block image" />
                </div>
                <p className="fs-6">
                    {studentData?.firstName || " "} {studentData?.lastName || ""}
                </p>
                <div className="card_text_style">
                    <p className="fs-6">{studentData?.standard || "-"}</p>
                    <p className="fs-6">Roll No :- {studentData?.rollNumber || "-"}</p>
                    <p className="fs-6">{studentData?.monthYear || "-"}</p>
                </div>
            </div>
            <div className="text-center mx-auto card_details_text">
                <p className="text-nowrap fs-6">
                    Total Day <br />
                    <span>{studentData?.totalDay || "0"}</span>
                </p>
                <p className="text-nowrap fs-6">
                    Present Day <br />
                    <span>{studentData?.presentDay || "0"}</span>
                </p>
                <p className="text-nowrap fs-6">
                    Average result <br />
                    <span>{parseFloat(studentData.averageResult).toFixed(2) + "%" || "0"}</span>
                </p>
                <p className="text-nowrap fs-6">
                    Last year <br /> percentage
                    <br />
                    <span>{`${studentData?.lastYearPercentage ? studentData?.lastYearPercentage : "0"}`}</span>
                </p>
            </div>
        </div>
    );
};

export default StudentCard;
