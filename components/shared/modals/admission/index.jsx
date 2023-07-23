import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Col, Form, Modal, Row } from "react-bootstrap";

import "./style.scss";
import Table from "../../Table";
import { ErrorMessage, InputItem, Label } from "../../forms";
import { defaultAdmissonConfirm } from "../../../../utils/constants/api/defaultValue";
import { Validation } from "../../../../utils/constants/validation/validation";
import { actions } from "../../../../redux/store";
import { resetEnquiryStore } from "../../../../views/pages/Enquiry/Guardian";
import { isValidArray } from "../../../../utils/constants/validation/array";
import CustomSelect, { ModifiedSelect } from "../../options/CustomSelect";
import { CustomDatePicker } from "../../../../views/pages/Enquiry/Enquiry";
import { useConfirmAdmissionMutation } from "../../../../api/admission";
import { showErrorToast } from "../../../../utils/constants/api/toast";
import { admissionFormSelect } from "../../options/styles/CreatableSelect";
import useErrorCatcher from "../../../../utils/constants/hooks/useErrorCatcher";
import { useCreateRollNumberMutation, useGetFeesDetailsQuery } from "../../../../api/admission";

const formatPayloadDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY") : "";
};

const AdmissionModal = () => {
    const { pathname } = useLocation();
    const datePickerRef = useRef(null);
    const admissionDatePickerRef = useRef(null);
    const { open } = useSelector((state) => state?.modal?.admission) || {};
    const { studentId } = useSelector((state) => state?.enquiry);

    const [standardsOption, setStandardOption] = useState([]);
    const [batchOption, setBatchOption] = useState([]);
    const [shiftOption, setShiftOption] = useState([]);

    const { data: feesDetailsResponse, isFetching } = useGetFeesDetailsQuery(studentId, { refetchOnMountOrArgChange: true, skip: !studentId });
    const [admissionConfirmReq, { isLoading, error }] = useConfirmAdmissionMutation();
    const [createRollNumber, { rollNumberLoading, erorr: rollNumberError, isError }] = useCreateRollNumberMutation();
    useErrorCatcher({ error: rollNumberError, isError });

    const form = useForm({
        defaultValues: { ...defaultAdmissonConfirm },
        resolver: yupResolver(Validation.ADMISSION_CONFIRM),
    });

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        register,
        getValues,
        reset,
        formState: { errors },
    } = form;

    const handleClose = () => {
        actions.modal.closeAdmission();
        resetEnquiryStore();
        actions.enquiry.setStudentId("");
        actions.enquiry.setIsConfirmAdmission(false);
    };

    const formData = watch();

    const handleBatchesOption = (batchArr) => {
        return isValidArray(batchArr) && batchArr?.map((item) => ({ value: item?._id, label: item?.name }));
    };
    const handleStandardOption = (standardArr) => {
        return isValidArray(standardArr) && standardArr.map((item) => ({ value: item?._id, label: item?.name }));
    };
    const handleShiftOption = (shiftArr) => {
        return isValidArray(shiftArr) && shiftArr.map((item) => ({ value: item?._id, label: item?.name }));
    };

    const countCollectedFees = (studentFees = []) => {
        setValue("collectedFees", isValidArray(studentFees) ? studentFees?.reduce((acc, cv) => +acc + Number(cv?.amount), 0) : "0");
    };

    const countPendingFees = () => {
        const { totalFees, amount, discount, collectedFees } = getValues();
        const pendingFees = Number(totalFees) - Number(amount) - Number(discount) - Number(collectedFees || 0);
        setValue("pendingFees", pendingFees || null);
    };

    useEffect(() => {
        if (feesDetailsResponse?.status !== 200) return;
        const { data } = feesDetailsResponse;
        const { batchs, standards, shifts, student, studentFees } = data;
        setBatchOption(handleBatchesOption(batchs)), setStandardOption(handleStandardOption(standards)), setShiftOption(handleShiftOption(shifts));

        setValue("studentId", studentId ?? ""), setValue("standardId", student?.standardId?._id);
        setValue("batchId", student?.batchId?._id ?? ""), setValue("shiftId", student?.shiftId?._id ?? "");

        setValue("discount", student?.discount ?? "0"), setValue("totalFees", feesDetailsResponse?.data?.student?.standardId?.fees ?? null);
        setValue("rollNumber", student?.rollNumber ?? "");
        countCollectedFees(studentFees);
        countPendingFees();
        generateRollNumber();
    }, [feesDetailsResponse]);

    useEffect(() => {
        if (!error) return;
        showErrorToast(error?.data?.message || "Something Went Wrong");
    }, [error]);

    const onSubmit = async (data) => {
        const payload = {};
        Object.keys(defaultAdmissonConfirm).forEach((key) => {
            if (["addmissionDate", "date"].includes(key)) payload[key] = formatPayloadDate(data[key]);
            else payload[key] = data[key] || "";
        });

        const response = await admissionConfirmReq(payload);

        if ([200, 201, 202, "success", "Success"].includes(response?.data?.status)) {
            actions.modal.closeAdmission();
            reset();
        }
    };

    const handleSelectChange = (selectedOption, key) => setValue(key, selectedOption?.value ?? "");
    const handleAmountChange = (e) => {
        setValue("amount", e.target.value || 0);
        countPendingFees();
    };

    const handleDiscount = (e) => {
        setValue("discount", e.target.value || 0);
        countPendingFees();
    };

    const generateRollNumber = async () => {
        if (pathname === "/accounts") return;
        const rollNo = await createRollNumber({ studentId, batchId: getValues("batchId") });
        setValue("rollNumber", rollNo?.data?.data);
    };

    const handleSelectingBatchId = async (selectedBatch) => {
        setValue("batchId", selectedBatch?.value ?? "");
        generateRollNumber();
    };

    const column = [
        { name: "date", label: "Date" },
        { name: "fee", label: "Fee", renderer: () => feesDetailsResponse?.data?.student?.standardId?.fees || (0).toString() },
        { name: "discount", label: "Discount", renderer: () => feesDetailsResponse?.data?.student?.discount || (0).toString() },
        { name: "amount", label: "Total Amount" },
    ];

    return (
        <Modal show={open} onHide={handleClose} size="xl" className="overflow-hidden" centered>
            <Modal.Body className="bg-white rounded-4 modal__body modal-dialog-scrollable">
                <h3 className="text-center">Fees method</h3>
                <Form onSubmit={handleSubmit(onSubmit)} className="position-relative">
                    <div className="form__content px-2">
                        <div className="d-flex justify-content-center my-3">
                            <Col sm={12} lg={4}>
                                <Label name={"date"} title="Admission Date" form={form} classNameLabel={"admissionLabel"} />
                                <Controller
                                    name="addmissionDate"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <div className="datepicker-container">
                                                <CustomDatePicker
                                                    dateFormat="dd/MM/yyyy"
                                                    showPopperArrow={false}
                                                    placeholderText="Select date"
                                                    ref={admissionDatePickerRef}
                                                    selected={value || null}
                                                    onChange={(date) => {
                                                        onChange(date);
                                                    }}
                                                    className="bg-white shadow"
                                                />
                                            </div>
                                            {<ErrorMessage error={errors?.addmissionDate} />}
                                        </>
                                    )}
                                />
                            </Col>
                        </div>
                        <Row className="mb-2">
                            <Col sm={12} lg={4}>
                                <Label name={"date"} title="Standard :" form={form} classNameLabel={"admissionLabel"} />
                                <CustomSelect
                                    isDisabled={true}
                                    className="educational_select_width"
                                    title="Standard"
                                    {...register("standardId")}
                                    field={register("standardId")}
                                    form={form}
                                    onCustomHandleChange={(data) => handleSelectChange(data, "standardId")}
                                    options={standardsOption}
                                />
                            </Col>
                            <Col sm={12} lg={4}>
                                <ModifiedSelect
                                    className="educational_select_width"
                                    title="Batch :"
                                    name="batchId"
                                    control={control}
                                    handleCustomChange={(selectedBatch) => handleSelectingBatchId(selectedBatch)}
                                    options={batchOption}
                                    form={form}
                                    costumeLabelStyle={"admissionLabel"}
                                    costumeSelectStyle={admissionFormSelect}
                                />
                            </Col>
                            <Col sm={12} lg={4} className="mt-5 mt-lg-0">
                                <InputItem
                                    name={"rollNumber"}
                                    title={"Roll no. : "}
                                    form={form}
                                    size={4}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col sm={12} lg={4}>
                                <Label name={"date"} title="Fees Date :" form={form} classNameLabel={"admissionLabel"} />
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
                                                    onChange={(date) => onChange(date)}
                                                    className="bg-white shadow"
                                                />
                                            </div>
                                            {<ErrorMessage error={errors?.date} />}
                                        </>
                                    )}
                                />
                            </Col>
                            <Col sm={12} lg={4}>
                                <InputItem
                                    type="number"
                                    min="0"
                                    name={"amount"}
                                    title={"Amount : "}
                                    form={form}
                                    size={4}
                                    onInput={handleAmountChange}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                />
                            </Col>
                            <Col sm={12} lg={4}>
                                <InputItem
                                    type="number"
                                    min="0"
                                    name={"discount"}
                                    title={"Discount : "}
                                    form={form}
                                    size={4}
                                    onInput={handleDiscount}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col sm={12} lg={4}>
                                <InputItem
                                    type="number"
                                    min="0"
                                    name={"totalFees"}
                                    title={"Total fees : "}
                                    form={form}
                                    size={4}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                    readOnly
                                />
                            </Col>
                            <Col sm={12} lg={4}>
                                <InputItem
                                    type="number"
                                    min="0"
                                    name={"pendingFees"}
                                    title={"Pending fees : "}
                                    form={form}
                                    size={4}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                    readOnly
                                />
                            </Col>
                            <Col sm={12} lg={4}>
                                <InputItem
                                    name={"collectedFees"}
                                    title={"Collected fees : "}
                                    form={form}
                                    size={4}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="mb-5 ">
                            <Col sm={12} lg={4} className="">
                                <PaymentMode control={control} name={"mode"} />
                            </Col>
                            <Col sm={12} lg={4} className="mt-4 mt-lg-0">
                                {formData.mode === "cheque" ? (
                                    <InputItem
                                        name={"chequeNumber"}
                                        title={"Cheque no. : "}
                                        className={"admissionInput"}
                                        classNameLabel={"admissionLabel"}
                                        form={form}
                                        size={4}
                                    />
                                ) : (
                                    <></>
                                )}
                            </Col>
                            <Col sm={12} lg={4}>
                                <ModifiedSelect
                                    className="educational_select_width"
                                    title="Shift"
                                    name="shiftId"
                                    control={control}
                                    options={shiftOption}
                                    form={form}
                                    costumeLabelStyle={"admissionLabel"}
                                    costumeSelectStyle={admissionFormSelect}
                                />
                                <div style={{ height: "36.8px" }}></div>
                            </Col>
                            <Col className="">
                                <InputItem
                                    name={"reason"}
                                    title={"Reason : "}
                                    className={"admissionInput"}
                                    classNameLabel={"admissionLabel"}
                                    form={form}
                                    size={12}
                                />
                            </Col>
                        </Row>
                        {isValidArray(feesDetailsResponse?.data?.studentFees) && (
                            <div className="border border-dark">
                                <Table items={feesDetailsResponse?.data?.studentFees} columns={column} />
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-4 saveButton">
                        <button type="submit" className="submit_button" disabled={isFetching || isLoading || rollNumberLoading}>
                            Save
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AdmissionModal;

const PaymentMode = ({ control, name }) => {
    return (
        <Form.Group as={Col}>
            <Label name="addmissionDate" title="Payment mode :" classNameLabel={"admissionLabel"} />
            <div className="d-flex align-items-center my-auto mt-2">
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Form.Check
                            {...field}
                            type="radio"
                            id="cash"
                            label="Cash"
                            value="cash"
                            checked={field.value === "cash"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="me-2 d-flex radio_label"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Form.Check
                            {...field}
                            type="radio"
                            id="cheque"
                            label="Cheque"
                            value="cheque"
                            checked={field.value === "cheque"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={"me-2 d-flex radio_label"}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Form.Check
                            {...field}
                            type="radio"
                            id="UPI"
                            label="UPI"
                            value="UPI"
                            checked={field.value === "UPI"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={"d-flex radio_label"}
                        />
                    )}
                />
            </div>
        </Form.Group>
    );
};
