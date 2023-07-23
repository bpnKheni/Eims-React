import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";

import "./style.scss";
import { Label } from "../../../components/shared/forms";
import Table from "../../../components/shared/Table";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import BatchSelect from "../../../components/shared/options/BatchSelect";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { actions } from "../../../redux/store";
// import DatePickerField, { RangeDate } from "../../../components/shared/DatePicker/DatePicker";
// import dateIcon from "../../../assets/images/Attendance/dateIcon.svg";
import { StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { useCheckAttendanceQuery } from "../../../api/student";

const CheckAttendance = () => {
    const { selectedStandard: standardId, selectedBatch: batchId } = useSelector((state) => state.student);

    const [date, setDate] = useState(null);
    const [attendanceFilter, setAttendanceFilter] = useState("ALL_STUDENTS");
    const [studentRecord, setStudentRecord] = useState([]);

    const { data: attendanceData, isFetching } = useCheckAttendanceQuery(
        { standardId, batchId, date: format(new Date(date), "dd/MM/yyyy") },
        { refetchOnMountOrArgChange: true, skip: !standardId || !batchId || !date }
    );

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(attendanceData?.status)) return;
        setStudentRecord(attendanceData?.data?.studentAttendance);

        if (attendanceFilter !== "ALL_STUDENTS") {
            setStudentRecord((prevRecords) => {
                return prevRecords.filter((item) => {
                    return attendanceFilter === "PRESENT_STUDENTS" ? item?.status === true : item?.status === false;
                });
            });
        }
    }, [attendanceData, attendanceFilter]);

    const column = [
        { name: "no", label: "No", renderer: (_, idx) => (idx + 1).toString() },
        { name: "rollNumber", label: "ID NO" },
        { name: "studentName", label: "Student Name" },
        {
            name: "present",
            label: "Present",
            renderer: (item) => {
                return (
                    <Form.Check type="checkbox" readOnly checked={["true", true].includes(item.status)} onChange={(e) => {}} className="present m-0 p-0 mt-2" />
                );
            },
        },
        {
            name: "absent",
            label: "Absent",
            renderer: (item) => {
                return (
                    <Form.Check
                        readOnly
                        type="checkbox"
                        checked={["false", false].includes(item?.status)}
                        onChange={(e) => {}}
                        className="absent m-0 p-0 mt-2"
                    />
                );
            },
        },
    ];

    return (
        <div className="">
            <Row className="gy-2">
                <Col sm={12} md={4}>
                    <Label name="Standard" title="Standard" classNameLabel={"attendance_label"} />
                    <StandardSelect
                        styles={StandardModifiedSelectStyle}
                        handleChange={(standard) => {
                            actions.student.setStandard(standard);
                        }}
                    />
                </Col>
                <Col sm={12} md={4}>
                    <Label name="Batch" title="Batch" classNameLabel={"attendance_label"} />
                    <BatchSelect
                        styles={StandardModifiedSelectStyle}
                        handleChange={(batch) => {
                            actions.student.setBatch(batch);
                        }}
                    />
                </Col>
                <Col sm={12} md={4} className="overLay">
                    <Label name={"date"} title="Date" classNameLabel={"attendance_label"} />
                    <DatePicker dateFormat="dd/MM/yyyy" selected={date} onChange={(date) => setDate(date)} className="" />
                </Col>
            </Row>
            <div className="my-3 d-flex justify-content-start justify-content-sm-center w-100">
                <Selection value={attendanceFilter} setValue={setAttendanceFilter} />
            </div>
            <Row className="gx-2">
                <Col sm={12} md={6}>
                    <div className="align-items-center d-flex justify-content-between Total_Students">
                        <span className="d-block text-truncate ">Total Present Students</span>
                        <span className="d-block">{attendanceData?.data?.allPresentStudent || "00"}</span>
                    </div>
                </Col>
                <Col sm={12} md={6} className="mt-3 mt-md-0">
                    <div className="align-items-center d-flex justify-content-between Total_Students">
                        <span className="d-block text-truncate">Total Absent Students</span>
                        <span className="d-block">{attendanceData?.data?.totalAbsentStudent || "00"}</span>
                    </div>
                </Col>
            </Row>
            <p className="fs-3 my-2">List</p>
            <div className="border border-dark" style={{ height: "calc(100vh - 510px)", overflow: "auto" }}>
                <Table items={studentRecord} columns={column} className="table_width" />
            </div>
        </div>
    );
};

const Selection = ({ value, setValue }) => {
    return (
        <div style={{ width: "100%" }}>
            <div className="d-flex flex-wrap justify-content-start justify-content-sm-center justify-content-between align-items-center mt-2">
                <Form.Check
                    type="radio"
                    id="allStudents"
                    label="All Students"
                    value="ALL_STUDENTS"
                    checked={value === "ALL_STUDENTS"}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ marginRight: "3%" }}
                    className="attendance_radio shadow-none"
                />
                <Form.Check
                    type="radio"
                    id="presentStudents"
                    label="Present Students"
                    value="PRESENT_STUDENTS"
                    checked={value === "PRESENT_STUDENTS"}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ marginRight: "3%" }}
                    className="attendance_radio shadow-none"
                />
                <Form.Check
                    type="radio"
                    id="absentStudents"
                    label="Absent Students"
                    value="ABSENT_STUDENTS"
                    checked={value === "ABSENT_STUDENTS"}
                    onChange={(e) => setValue(e.target.value)}
                    className={"attendance_radio shadow-none"}
                />
            </div>
        </div>
    );
};

export default CheckAttendance;
