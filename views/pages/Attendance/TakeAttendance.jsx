import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";

import { Label } from "../../../components/shared/forms";
import BatchSelect from "../../../components/shared/options/BatchSelect";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import Table from "../../../components/shared/Table";
import { actions } from "../../../redux/store";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { Validation } from "../../../utils/constants/validation/validation";
import { defaultAttendance } from "../../../utils/constants/api/defaultValue";
import { useCheckAttendanceQuery, useGetStudentRecordQuery, useTakeAttendanceMutation } from "../../../api/student";
import search from "../../../assets/images/Attendance/search.svg";
import close from "../../../assets/images/Attendance/close-circle.svg";
import { showErrorToast } from "../../../utils/constants/api/toast";
import { isValidArray } from "../../../utils/constants/validation/array";
import { StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import "./style.scss";

const TakeAttendance = () => {
    const { selectedStandard: standardId, selectedBatch: batchId } = useSelector((state) => state.student);

    // Do not change the order of form, needed below it's method
    const form = useForm({
        defaultValues: defaultAttendance,
        resolver: yupResolver(Validation.ATTENDANCE),
    });

    const { control, handleSubmit, setValue, getValues, reset, watch } = form;

    const [studentRecord, setStudentRecord] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [date, setDate] = useState(watch("date"));

    // const { data, isFetching } = useGetStudentRecordQuery({ standardId, batchId }, { refetchOnMountOrArgChange: true, skip: true }); // temporary closed this api
    const { data: attendanceData } = useCheckAttendanceQuery(
        { standardId, batchId, date: format(new Date(date), "dd/MM/yyyy") },
        { refetchOnMountOrArgChange: true, skip: !standardId || !batchId || !date }
    );
    const [attendanceReq, { isLoading, error }] = useTakeAttendanceMutation();

    const formData = watch();

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(attendanceData?.status)) return;
        const attendanceReport = attendanceData?.data?.studentAttendance;
        setStudentRecord(attendanceReport);

        const filterData =
            searchQuery &&
            isValidArray(attendanceReport) &&
            attendanceReport?.filter(({ studentName, rollNumber }) => {
                const isSearchIncludes = (query) => query?.toLowerCase().includes(searchQuery.toLowerCase());
                return isSearchIncludes(studentName) || isSearchIncludes(rollNumber);
            });

        searchQuery && setStudentRecord(filterData);

        const studentArr = [];
        (searchQuery ? filterData : attendanceReport)?.forEach(({ studentId, status }) => {
            studentArr.push({ studentId, attendance: status });
        });

        setValue("studentId", studentArr);

        return () => setStudentRecord([]);
    }, [searchQuery, attendanceData]);

    useEffect(() => {
        error && showErrorToast(error?.data?.message);
    }, [error]);

    const handleClearClick = () => {
        setSearchQuery("");
    };

    const handleAttendance = (e, item) => {
        const studentId = item?.studentId;
        const attendanceArr = getValues()?.studentId;
        const studentIdxInAttendanceArr = isValidArray(attendanceArr) && attendanceArr?.findIndex((student) => student?.studentId === studentId);
        attendanceArr[studentIdxInAttendanceArr] = { ...attendanceArr[studentIdxInAttendanceArr], attendance: e.target.checked };
        setValue("studentId", attendanceArr);
    };

    const handleAttendanceSubmit = async (data) => {
        data = { ...data, date: format(new Date(data?.date), "dd/MM/yyyy") };
        data.studentId = hanldeSubmittedAttendanceArr(getValues("studentId"), attendanceData?.data?.studentAttendance, searchQuery);

        const response = await attendanceReq(data);
    };

    const column = [
        { name: "no", label: "No", renderer: (_, idx) => (idx + 1).toString() },
        { name: "idNo", label: "ID NO", renderer: ({ rollNumber }) => rollNumber || "" },
        { name: "studentName", label: "Student Name" },
        {
            name: "present",
            label: "Present",
            renderer: (item, index) => {
                return (
                    <Controller
                        control={control}
                        name={`studentId.${index}.attendance`}
                        render={({ field }) => {
                            return (
                                <Form.Check
                                    type="checkbox"
                                    checked={["true", true].includes(field.value)}
                                    onChange={(e) => handleAttendance(e, item)}
                                    className="present m-0 p-0 mt-2"
                                />
                            );
                        }}
                    />
                );
            },
        },
        {
            name: "absent",
            label: "Absent",
            renderer: (item, index) => {
                return (
                    <Controller
                        control={control}
                        name={`studentId.${index}.attendance`}
                        render={({ field }) => (
                            <Form.Check
                                readOnly
                                type="checkbox"
                                checked={["false", false].includes(field.value)}
                                onChange={(e) => handleAttendance(e, item)}
                                className="absent m-0 p-0 mt-2"
                            />
                        )}
                    />
                );
            },
        },
    ];

    return (
        <Form onSubmit={handleSubmit(handleAttendanceSubmit)} className=" position-relative" style={{ height: "78vh" }}>
            <Row>
                <Col sm={12} md={6} lg={4}>
                    <Label name="Standard" title="Standard" classNameLabel={"attendance_label"} />
                    <StandardSelect
                        styles={StandardModifiedSelectStyle}
                        handleChange={(standard) => {
                            setValue("standardId", standard);
                            actions.student.setStandard(standard);
                        }}
                    />
                </Col>
                <Col sm={12} md={6} lg={4} className="overLay">
                    <Label name={"date"} title="Date" classNameLabel={"attendance_label"} />
                    <Controller
                        name="date"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <>
                                <div className="datepicker-container">
                                    <CustomDatePicker
                                        dateFormat="dd/MM/yyyy"
                                        showPopperArrow={false}
                                        placeholderText="Select date"
                                        selected={value || null}
                                        onChange={(date) => {
                                            setDate(date);
                                            onChange(date);
                                        }}
                                        style={{ backgroundColor: "#fff" }}
                                    />
                                </div>
                            </>
                        )}
                    />
                </Col>
                <Col sm={12} md={6} lg={4}>
                    <Label name="Batch" title="Batch" classNameLabel={"attendance_label"} />
                    <BatchSelect
                        styles={StandardModifiedSelectStyle}
                        handleChange={(batch) => {
                            setValue("batchId", batch);
                            actions.student.setBatch(batch);
                        }}
                    />
                </Col>
            </Row>

            <Row className="align-items-center justify-content-between my-3 text-center text-md-start">
                <Col sm={12} md={6}>
                    <div className="fs-3 d-block text-truncate lh-lg">Attendance List</div>
                </Col>
                <Col sm={12} md={6}>
                    <div className="d-flex Search_input align-items-center float-end">
                        <img src={search} className="mx-3" />
                        <Form.Control
                            type="text"
                            className="Search border-0 shadow-none bg-transparent"
                            size="lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery.trim().length > 0 && (
                            <button className="close_button" onClick={handleClearClick}>
                                <img src={close} className="mx-2" />
                            </button>
                        )}
                    </div>
                </Col>
            </Row>

            <div className="border border-dark" style={{ height: "calc(100vh - 400px)", overflow: "auto" }}>
                <Table items={studentRecord} columns={column} className="attendance_table" />
            </div>
            <button disabled={isLoading || !standardId || !batchId} className="submit">
                Submit
            </button>
        </Form>
    );
};

export default TakeAttendance;

const hanldeSubmittedAttendanceArr = (data, attendanceResponse, isSearchQuery) => {
    let arr = [];
    let studentIdSet = new Set();
    data?.forEach((item) => {
        studentIdSet.add(item?.studentId);
        if (item.attendance === true) return;
        else arr.push({ studentId: item?.studentId });
    });

    if (isSearchQuery) {
        attendanceResponse?.forEach((item) => {
            if (studentIdSet.has(item?.studentId) || item?.status === true) return;
            else arr.push({ studentId: item?.studentId });
        });
    }
    return isValidArray(arr) ? arr : [];
};
