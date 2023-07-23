import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiPlus } from "react-icons/fi";

import "./style.scss";
import "../../styles/app.scss";
import { actions } from "../../../redux/store";
import { Label, ErrorMessage } from "../../../components/shared/forms";
import { Validation } from "../../../utils/constants/validation/validation";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";
import BatchSelect from "../../../components/shared/options/BatchSelect";
import { useCreateTimeTableMutation } from "../../../api/timeTable";
import { prepareFormData } from "../../../utils/constants/api/formData";
import { roleSelectStyle, StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { useSelector } from "react-redux";

const TimeTable = () => {
    const { selectedBatch: batch, selectedStandard: standardId } = useSelector((state) => state.student);

    const [selectedFile, setSelectedFile] = useState(null);

    const form = useForm({
        defaultValues: { standardId: "", batchId: "", image: null },
        resolver: yupResolver(Validation.TIME_TABLE),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = form;

    const [createTimeTable, { isLoading: createLoading, error: createError, isError: isCreateError }] = useCreateTimeTableMutation();
    useErrorCatcher({ error: createError, isError: isCreateError });

    const onSubmit = async (data) => {
        const timeTablePayload = { ...data };

        const formData = prepareFormData(timeTablePayload);

        await createTimeTable(formData);
        reset();
        actions.student.setStandard("");
        actions.student.setBatch("");
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setValue("image", file);
    };

    return (
        <>
            <h2 className="text-center text-dark my-3">Time table</h2>

            <Container fluid className="mt-3 exam-container">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="position-relative w-100">
                        <div className=" position-absolute w-100">
                            <Row className="mb-2">
                                <Col sm={12} lg={6} style={{ height: "118px" }}>
                                    <Label name="Standard" title="Standard" form={form} classNameLabel={"exam_label"} />
                                    <Controller
                                        control={control}
                                        name={`standardId`}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <StandardSelect
                                                    defaultStandard={standardId}
                                                    styles={roleSelectStyle}
                                                    handleChange={(selectedOption) => {
                                                        onChange(selectedOption || null);
                                                        actions.student.setStandard(selectedOption);
                                                    }}
                                                />
                                                {errors[`standardId`] && !value && <ErrorMessage error={errors[`standardId`]} />}
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col sm={12} md={6} style={{ height: "118px" }}>
                                    <Label name="Batch" title="Batch" classNameLabel={"exam_label"} />
                                    <Controller
                                        control={control}
                                        name={`batchId`}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <BatchSelect
                                                    defaultBatch={batch}
                                                    styles={StandardModifiedSelectStyle}
                                                    handleChange={(selectedOption) => {
                                                        onChange(selectedOption || null);
                                                        actions.student.setBatch(selectedOption);
                                                    }}
                                                />
                                                {errors[`batchId`] && !value && <ErrorMessage error={errors[`batchId`]} />}
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <div className="d-flex align-items-center">
                                    {selectedFile && (
                                        <div className="preview_image_div me-3">
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-100 preview_image" />
                                        </div>
                                    )}
                                    <div className="align-self-center">
                                        <label htmlFor="fileSelect" type="button" className="image_select_button fs-1 text-center py-auto">
                                            <span className="align-self-center">
                                                <FiPlus className="mt-4" />
                                            </span>
                                        </label>
                                        <input type="file" onChange={handleFileChange} id="fileSelect" className="d-none" />
                                        {!selectedFile && errors["image"] && <ErrorMessage error={errors["image"]} />}
                                    </div>
                                </div>
                            </Row>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="submit_button fs-4 fw-bold mx-auto d-block px-5 py-2 position-fixed bottom-50 ">
                            {createLoading ? "Loading" : "Save"}
                        </button>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default TimeTable;
