import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, isValid, parse } from "date-fns";
import { Col, Row, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./style.scss";
import BatchSelect from "../../../components/shared/options/BatchSelect";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import { defaultCreateNotice } from "../../../utils/constants/api/defaultValue";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { ErrorMessage, InputItem, Label } from "../../../components/shared/forms";
import { useCreateNoticeMutation, useUpdateNoticeMutation } from "../../../api/noticeboard";
import { Validation } from "../../../utils/constants/validation/validation";
import { actions } from "../../../redux/store";

const CreateNotice = () => {
    const { noticeId } = useParams();
    const { state, pathname } = useLocation();
    const navigate = useNavigate();

    const [createNoticeReq, { isLoading: isCreating, error: createError, isError: isCreateError }] = useCreateNoticeMutation();
    const [updateNoticeReq, { isLoading: isUpdating, error: updateError, isError: isUpdateError }] = useUpdateNoticeMutation();

    // Global Error Catcher hook
    useErrorCatcher({ error: createError, isError: isCreateError }), useErrorCatcher({ error: updateError, isError: isUpdateError });

    const isCreatingNotice = pathname.startsWith("/create-notice");

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Disable past dates
    const maxDate = new Date(today.getFullYear() + 1, 11, 31);

    const form = useForm({
        defaultValues: defaultCreateNotice,
        resolver: yupResolver(Validation.NOTICE),
    });

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit,
        getValues,
    } = form;

    useEffect(() => {
        if (!state) return;

        Object.keys(defaultCreateNotice).forEach((key) => {
            setValue(key, state[key] || "");
        });

        const parsedDate = parse(state?.date, "dd/MM/yyyy", new Date());
        const selectedDate = isValid(parsedDate) ? parsedDate : new Date();
        setValue("date", selectedDate);
        actions.student.setStandard(getValues("standardId") || "");
        actions.student.setBatch(getValues("batchId") || "");
    }, [state]);

    const handleNoticeSubmit = async (data) => {
        data = { ...data, date: format(new Date(data?.date), "dd/MM/yyyy") };
        console.log("data >>>>>> ", data);
        noticeId ? await updateNoticeReq({ ...data, id: noticeId }) : await createNoticeReq(data);
        navigate("/noticeboard");
    };

    return (
        <>
            <div className="">
                {!isCreatingNotice ? (
                    <div className="text-center mt-2">
                        <span className="edit_title fs-2">Edit</span>
                    </div>
                ) : (
                    <p className="CreateNotice_title fs-2">Create Notice</p>
                )}
                <Form
                    onSubmit={handleSubmit(handleNoticeSubmit)}
                    className="d-flex flex-column justify-content-between main_div position-relative"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <div>
                        <Row>
                            <Col sm={12} md={4}>
                                <Label name={"date"} title="Date" classNameLabel="notice_label" />
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
                                                    minDate={minDate}
                                                    maxDate={maxDate}
                                                    onChange={(date) => onChange(date)}
                                                    style={{ backgroundColor: "#fff" }}
                                                />
                                            </div>
                                        </>
                                    )}
                                />
                            </Col>
                            <Col sm={12} md={4} className="mt-5 mt-md-0">
                                <Label name="Standard" title="Standard" classNameLabel="notice_label" />
                                <Controller
                                    control={control}
                                    name={`standardId`}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <StandardSelect
                                                defaultStandard={value}
                                                styles={StandardModifiedSelectStyle}
                                                handleChange={(selectedOption) => {
                                                    onChange(selectedOption || null);
                                                    actions.student.setStandard(selectedOption);
                                                }}
                                            />
                                            {errors[`standardId`] && <ErrorMessage error={errors[`standardId`]} />}
                                        </>
                                    )}
                                />
                            </Col>
                            <Col sm={12} md={4} className="mt-5 mt-md-0">
                                <Label name="Batch" title="Batch" classNameLabel="notice_label" />
                                <Controller
                                    control={control}
                                    name={`batchId`}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <BatchSelect
                                                defaultBatch={value}
                                                styles={StandardModifiedSelectStyle}
                                                handleChange={(selectedOption) => {
                                                    onChange(selectedOption || null);
                                                    actions.student.setBatch(selectedOption);
                                                }}
                                            />
                                            {errors[`batchId`] && <ErrorMessage error={errors[`batchId`]} />}
                                        </>
                                    )}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col sm={12}>
                                <InputItem name={"title"} title={"title"} form={form} classNameLabel="notice_label" className="notice_input shadow-none" />
                            </Col>
                            <Col sm={12}>
                                <InputItem name={"details"} title={"Details"} form={form} classNameLabel="notice_label" className="notice_input shadow-none" />
                            </Col>
                        </Row>
                    </div>
                    <div className="text-center position-absolute bottom-0 start-50 translate-middle-x">
                        <button disabled={isCreating || isUpdating} className="submit_button px-4 fs-4 fw-semibold">
                            {!isCreatingNotice ? "Update" : "Submit"}
                        </button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default CreateNotice;
