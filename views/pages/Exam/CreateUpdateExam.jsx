import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { format, isValid, parse } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";

import "./style.scss";
import "../../styles/app.scss";
import { ModifiedSelect } from "../../../components/shared/options/CustomSelect";
import { InputItem, Label, ErrorMessage } from "../../../components/shared/forms";
import { Validation } from "../../../utils/constants/validation/validation";
import { useCreateExamMutation, useGenerateTestNumberQuery, useUpdateExamMutation } from "../../../api/exam";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import { roleSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { useGetStandardAndSubjectQuery } from "../../../api/standardAndSubject";
import { formatSubjectOptions } from "../Staff/CreateUpdateStaff";
import { isValidArray } from "../../../utils/constants/validation/array";
import { defaultExamValue } from "../../../utils/constants/api/defaultValue";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";

const CreateUpdateExam = () => {
    const navigate = useNavigate();
    const { examId } = useParams();
    const { pathname, state } = useLocation();

    const datePickerRef = useRef(null);
    const [subjectOptionsForAllStd, setSubjectOptionsForAllStd] = useState([]);

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Disable past dates
    const maxDate = new Date(today.getFullYear() + 1, 11, 31);

    const isCreateMode = pathname === "/exam/schedule-exam/create-exam";
    const examPrefillData = state?.examData || null;

    const form = useForm({
        defaultValues: defaultExamValue,
        resolver: yupResolver(Validation.EXAM),
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = form;

    const { data: stdAndSubjectResponse, isFetching } = useGetStandardAndSubjectQuery(null, { refetchOnMountOrArgChange: true });
    const { data: testNumber, isFetching: isFetchingTestNumber } = useGenerateTestNumberQuery(watch("standardId"), {
        refetchOnMountOrArgChange: false,
        skip: !isCreateMode,
    });

    const [createExam, { isLoading: createLoading, error: createError, isError: isCreateError }] = useCreateExamMutation();
    const [updateExam, { isLoading: updateLoading, error: updateError, isError: isUpdateError }] = useUpdateExamMutation();
    useErrorCatcher({ error: createError, isError: isCreateError }), useErrorCatcher({ error: updateError, isError: isUpdateError });

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(testNumber?.status)) return;
        setValue("testNumber", testNumber?.data || "");
    }, [testNumber]);

    useEffect(() => {
        if (!examPrefillData) return;
        Object.keys(defaultExamValue).forEach((key) => {
            setValue(key, examPrefillData[key] || "");
        });

        const date = examPrefillData["date"];
        setValue("date", isValid(parse(date, "dd/MM/yyyy", new Date())) ? parse(date, "dd/MM/yyyy", new Date()) : new Date());
    }, [examPrefillData, setValue]);

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(stdAndSubjectResponse?.status)) return;

        let optionsArr =
            isValidArray(stdAndSubjectResponse?.data) &&
            stdAndSubjectResponse?.data?.map((item) => {
                let obj = {}; // { standardId: "_id", subjects : [{value: '_id', label: 'Subject Name'}] }
                obj.standardId = item?.standardId;
                obj.subjects = formatSubjectOptions(item);

                return obj;
            });

        setSubjectOptionsForAllStd(optionsArr);
    }, [stdAndSubjectResponse]);

    const onSubmit = async (data) => {
        const examData = {
            ...data,
            date: format(new Date(data?.date), "dd/MM/yyyy"),
        };

        isCreateMode ? await createExam(examData) : await updateExam({ examId, examData });

        navigate("/exam/schedule-exam");
        reset();
    };

    const handleSubjectsOptionsAsPerStd = useCallback(
        (standardId) => {
            const subObjAsPerStd = subjectOptionsForAllStd.find((item) => {
                return standardId === item?.standardId;
            });
            return subObjAsPerStd ? subObjAsPerStd.subjects : [];
        },
        [subjectOptionsForAllStd]
    );

    return (
        <>
            {!isCreateMode && <h3 className="edit-button">Edit</h3>}

            <Container fluid className="mt-3 exam-container">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="position-relative w-100">
                        <div className=" position-absolute w-100">
                            <Row className="mb-2">
                                <Col sm={12} lg={6}>
                                    <Label name="Standard" title="Standard" form={form} classNameLabel={"exam_label"} />
                                    <Controller
                                        control={control}
                                        name={`standardId`}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <StandardSelect
                                                    defaultStandard={value}
                                                    styles={roleSelectStyle}
                                                    handleChange={(selectedOption) => {
                                                        onChange(selectedOption || null);
                                                    }}
                                                />
                                                {errors[`standardId`] && <ErrorMessage error={errors[`standardId`]} />}
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col lg={6}>
                                    <Label name="date" title="Date Selection" form={form} classNameLabel={"exam_label"} />
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
                                                        ref={datePickerRef}
                                                        selected={value || null}
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                        onChange={(date) => onChange(date)}
                                                    />
                                                </div>
                                                {<ErrorMessage error={errors?.date} />}
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={12} md={4} style={{ height: "118px" }}>
                                    <ModifiedSelect
                                        title={"Subject"}
                                        control={control}
                                        name={`subjectId`}
                                        form={form}
                                        options={handleSubjectsOptionsAsPerStd(watch(`standardId`))}
                                        costumeLabelStyle={"staff_label"}
                                        costumeSelectStyle={roleSelectStyle}
                                    />
                                </Col>
                                <Col sm="12" md="4" style={{ height: "118px" }}>
                                    <InputItem
                                        name={"totalMarks"}
                                        title={"Total Marks"}
                                        form={form}
                                        size={4}
                                        classNameLabel={"exam_label"}
                                        className="exam_input"
                                    />
                                </Col>
                                <Col sm="12" md="4" style={{ height: "118px" }}>
                                    <InputItem
                                        name={"testNumber"}
                                        title={"Test Number"}
                                        form={form}
                                        size={4}
                                        classNameLabel={"exam_label"}
                                        className="exam_input"
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-lg-0" style={{ height: "118px" }}>
                                <InputItem
                                    name="notes"
                                    title="Notes"
                                    form={form}
                                    as="textarea"
                                    rows={3}
                                    className="exam_textArea"
                                    classNameLabel={"exam_label"}
                                />
                            </Row>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button disabled={isFetching || isFetchingTestNumber} type="submit" className="staff-button position-fixed bottom-0 p-2">
                            {isCreateMode ? (createLoading ? "Loading" : "Save") : updateLoading ? "Loading" : "Update"}
                        </button>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default CreateUpdateExam;
