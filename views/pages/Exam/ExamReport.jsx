import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import { format, isValid, parse } from "date-fns";
import { Container, Row, Col, Form } from "react-bootstrap";

import "../../styles/app.scss";
import "../Staff/style.scss";
import "./style.scss";
import Table from "../../../components/shared/Table";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import { InputItem, Label, ErrorMessage } from "../../../components/shared/forms";
import { useCreateExamResultMutation, useGetExamReportQuery, useGetTestNumberQuery } from "../../../api/exam";
import { ModifiedSelect } from "../../../components/shared/options/CustomSelect";
import { admissionFormSelect, roleSelectStyle, StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { calcuatePercentage } from "../../../utils/constants/helper/percentage";
import { isValidArray } from "../../../utils/constants/validation/array";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";
import { defaultExamReportValues } from "../../../utils/constants/api/defaultValue";

const ExamReport = () => {
    const [testNumberOptions, setTestNumberOptions] = useState([]);
    const [studentData, setStudentData] = useState([]);

    const form = useForm({
        defaultValues: defaultExamReportValues,
        // resolver: yupResolver(),
    });

    const {
        control,
        formState: { errors },
        getValues,
        setValue,
        register,
        watch,
        handleSubmit,
    } = form;

    const { data: testNumberResponse, isFetching: isFetchingTestNumbers } = useGetTestNumberQuery(watch("standardId"), { skip: !watch("standardId") });
    const { data: examReportResponse, isFetching: isFetchingExamReport } = useGetExamReportQuery(
        {
            standardId: watch("standardId"),
            testNumber: watch("testNumber"),
        },
        { skip: !watch("standardId") || !watch("testNumber") }
    );
    const [createExamReq, { isLoading: isCreatingExam, error, isError }] = useCreateExamResultMutation();
    useErrorCatcher({ error, isError });

    const setStudentFormData = (studentData) => {
        return isValidArray(studentData)
            ? studentData?.map(({ studentId, isAbsent, marks }) => ({ studentId, marks, isAbsent }))
            : defaultExamReportValues?.studentResult;
    };

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(testNumberResponse?.status)) return;
        const testNumberOptionsArr = testNumberResponse?.data?.map(({ testNumber }) => {
            return { label: testNumber, value: testNumber };
        });
        setTestNumberOptions(testNumberOptionsArr);
    }, [testNumberResponse]);

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(examReportResponse?.status)) return;
        const { examData, studentData } = examReportResponse?.data;
        const date = examData?.[0]?.date;
        setValue("subject", examData?.[0]?.subject);
        setValue("totalMarks", examData?.[0]?.totalMarks);
        setValue("date", isValid(parse(date, "dd/MM/yyyy", new Date())) ? parse(date, "dd/MM/yyyy", new Date()) : new Date());

        setValue("studentResult", setStudentFormData(studentData));

        setStudentData(studentData);
    }, [examReportResponse, setValue]);

    const handleStudentMarkChange = (e, studentId, index) => {
        const studentResult = getValues("studentResult");

        setStudentData((prevData) => {
            const studentObj = prevData[index];
            const data = [...prevData];
            data[index] = { ...studentObj, marks: Number(e.target.value) };
            return data;
        });

        const updatedStudentResult = studentResult.map((student) => {
            if (student.studentId === studentId) {
                return {
                    ...student,
                    marks: Number(e.target.value),
                };
            }
            return student;
        });

        setValue("studentResult", updatedStudentResult);
    };

    const handleStudentReportSubmit = async (data) => {
        const examReport = {
            ...data,
            date: format(new Date(data?.date), "dd/MM/yyyy"),
            studentResult: formatStudentResultPayload(data?.studentResult),
        };

        const response = await createExamReq(examReport);
    };

    const columns = [
        {
            name: "number",
            label: "No",
            renderer: (_, index) => index + 1,
        },
        { name: "rollNumber", label: "Roll No." },
        {
            name: "studentName",
            label: "Student Name",
        },
        {
            name: "Absent",
            label: "Absent",
            renderer: (item, index) => {
                return (
                    <Controller
                        control={control}
                        name={`studentResult.${index}.isAbsent`}
                        render={({ field: { onChange, value } }) => {
                            return (
                                <Form.Check
                                    tabIndex={"-1"}
                                    type="checkbox"
                                    checked={["true", true].includes(value)}
                                    onChange={(e) => onChange(e.target.checked)}
                                    className="attendance m-0 p-0 mt-2 shadow-none"
                                />
                            );
                        }}
                    />
                );
            },
        },
        {
            name: "marks",
            label: "Obtain Marks",
            renderer: (item, index) => {
                return (
                    <Form.Control
                        disabled={watch(`studentResult.${index}.isAbsent`)}
                        type="number"
                        {...register(`studentResult.${index}.marks`)}
                        onChange={(e) => handleStudentMarkChange(e, item?.studentId, index)}
                        className="bg-transparent shadow-none border-0 text-center obtainMarksInput"
                    />
                );
            },
        },
        {
            name: "percentage",
            label: "Percentage",
            renderer: (item) => calcuatePercentage(item?.marks, watch("totalMarks")),
        },
    ];

    return (
        <>
            <Container fluid className="mt-3" style={{ height: "calc(100vh - 216px)", overflow: "auto" }}>
                <Form onSubmit={handleSubmit(handleStudentReportSubmit)}>
                    <Row className="mb-2">
                        <Col sm={12} md={4} style={{ height: "118px" }}>
                            <Label name="standard" title="Standard" form={form} classNameLabel={"exam_label"} />
                            <Controller
                                control={control}
                                name={`standardId`}
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <StandardSelect
                                            defaultStandard={value}
                                            styles={StandardModifiedSelectStyle}
                                            handleChange={(selectedOption) => onChange(selectedOption || null)}
                                        />
                                        {errors[`standardId`] && <ErrorMessage error={errors[`standardId`]} />}
                                    </>
                                )}
                            />
                        </Col>
                        <Col sm={12} md={4} style={{ height: "118px" }}>
                            <ModifiedSelect
                                className="educational_select_width"
                                title="Test Number"
                                name="testNumber"
                                control={control}
                                options={testNumberOptions}
                                form={form}
                                costumeLabelStyle={"exam_label mb-2"}
                                costumeSelectStyle={StandardModifiedSelectStyle}
                            />
                        </Col>
                        <Col sm={12} md={4} style={{ height: "118px" }}>
                            <Label name="date" title="Date" form={form} classNameLabel={"exam_label"} />
                            <Controller
                                control={control}
                                name="date"
                                render={({ field: { value, onChange } }) => (
                                    <div className="datepicker-container">
                                        <DatePicker
                                            placeholderText="Select date"
                                            onChange={(date) => onChange(date)}
                                            selected={value}
                                            showPopperArrow={false}
                                            shouldCloseOnSelect={false}
                                            dateFormat="dd/MM/yyyy"
                                            readOnly
                                        />
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm="12" md="6" style={{ height: "118px" }}>
                            <InputItem
                                name={"subject"}
                                title={"Subject Name"}
                                form={form}
                                size={6}
                                classNameLabel={"exam_label"}
                                className="exam_input"
                                readOnly
                            />
                        </Col>
                        <Col sm="12" md="6" style={{ height: "118px" }}>
                            <InputItem
                                name={"totalMarks"}
                                title={"Total Marks"}
                                form={form}
                                size={6}
                                classNameLabel={"exam_label"}
                                className="exam_input"
                                readOnly
                            />
                        </Col>
                    </Row>
                    <div className="border border-dark mt-4 text-align-center examReport" style={{ height: "calc(100vh - 485px)", overflow: "auto" }}>
                        <Table columns={columns} items={studentData} />
                    </div>
                    <div className="d-flex justify-content-center ">
                        <button disabled={isCreatingExam || isFetchingTestNumbers || isFetchingExamReport} className="staff-button position-fixed bottom-0 p-2">
                            Save
                        </button>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default ExamReport;

const formatStudentResultPayload = (studentResultArr) => {
    let responseArr = [];

    studentResultArr.forEach((student) => {
        if (!student?.isAbsent) {
            responseArr.push({ ...student, marks: parseInt(Number(student?.marks)) });
        }
    });

    return isValidArray(responseArr) ? responseArr : [];
};
