import DatePicker from "react-datepicker";
import { memo } from "react";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import { getMonth, getYear, parse, isValid } from "date-fns";

import "./style.scss";
import CustomSelect from "../../../components/shared/options/CustomSelect";
import { actions } from "../../../redux/store";
import { FooterContainer } from "../../../components/Enquiry";
import { Validation } from "../../../utils/constants/validation/validation";
import { ErrorMessage, InputItem, Label } from "../../../components/shared/forms";
import { defaultPersonalValues } from "../../../utils/constants/api/defaultValue";
import { OPTIONS } from "../../../utils/constants/option-menu";
import { setFormValues } from "../../../utils/constants/api/formData";
import { API } from "../../../utils/constants/api/schemas";

const Enquiry = memo(() => {
    const navigate = useNavigate();
    const datePickerRef = useRef(null);

    const { personalData, isUpdatingEnquiry, MobileNumber: mobileNumber } = useSelector((state) => state.enquiry);

    const [isFirstTime, setIsFirstTime] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useLayoutEffect(() => {
        !isUpdatingEnquiry && !mobileNumber && actions.modal.openMobile();
    }, [mobileNumber, isUpdatingEnquiry]);

    const form = useForm({
        defaultValues: defaultPersonalValues,
        resolver: yupResolver(Validation.ENQUIRY_FORM_FIRST),
    });

    const {
        register,
        setValue,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = form;

    const formData = watch();

    useEffect(() => {
        if (isFirstTime || isEqual(personalData, formData)) return;
        actions.enquiry.addPersonalData(formData);
    }, [formData, personalData, isFirstTime]);

    useEffect(() => {
        if ((!mobileNumber && !isUpdatingEnquiry) || !personalData || !isFirstTime) return;
        setFormValues(personalData, setValue);
        const photo = personalData[API.ENQUIRY.PERSONAL.PHOTO];
        setSelectedPhoto(photo || null);

        const parsedDate = parse(personalData[API.ENQUIRY.PERSONAL.DATE_OF_BIRTH], "dd/MM/yyyy", new Date());
        const selectedDate = isValid(parsedDate) ? parsedDate : new Date();

        setValue(API.ENQUIRY.PERSONAL.DATE_OF_BIRTH, selectedDate);
        setIsFirstTime(false);
    }, [personalData, isUpdatingEnquiry, isFirstTime, setValue, mobileNumber]);

    const onSubmitFirstForm = () => {
        navigate("/enquiry/form-second");
    };

    const handlePhotoSelect = (event) => {
        const file = event.target.files[0];
        setSelectedPhoto(file);
        setValue("photo", file);
    };

    return (
        <Container className="enquiry-container pb-4 pb-md-4 " fluid>
            <div className="d-flex justify-content-center">
                <div>
                    <div className="enquiry_form_student_photo">
                        <label htmlFor="photoInput" className="header-image">
                            {selectedPhoto ? (
                                <img
                                    src={typeof selectedPhoto === "string" ? selectedPhoto : URL.createObjectURL(selectedPhoto)}
                                    alt="Selected"
                                    className="selected_photo "
                                />
                            ) : (
                                <>
                                    <MdOutlineAddAPhoto className="add-photo-icon" />
                                    <p className="select-image-text">Student Photo</p>
                                </>
                            )}
                        </label>
                        <input id="photoInput" type="file" accept="image/*" {...register("photo")} onChange={handlePhotoSelect} className="d-none" />
                    </div>
                </div>
            </div>
            <div className="enquiry-form">
                <div className="form-container">
                    <Form noValidate onSubmit={handleSubmit(onSubmitFirstForm)}>
                        <Row className="mb-2">
                            <div className="d-sm-block d-md-flex w-100">
                                <div style={{ width: "115px" }}>
                                    <CustomSelect
                                        {...register("prefix")}
                                        field={register("prefix")}
                                        form={form}
                                        options={OPTIONS.PREFIX}
                                        defaultValue="mr"
                                        className="w-100"
                                    />
                                </div>
                                <Row className="w-100 ms-0 ms-md-2">
                                    <Col sm={12} md={4}>
                                        <InputItem
                                            name={"lastName"}
                                            title={"Surname"}
                                            form={form}
                                            size={4}
                                            classNameLabel={"d-block text-truncate enquiryLabelClassName"}
                                            className={"form__input border-0 form-control-lg"}
                                        />
                                    </Col>
                                    <Col sm={12} md={4}>
                                        <InputItem
                                            name={API.ENQUIRY.PERSONAL.FIRST_NAME}
                                            title={"First Name"}
                                            form={form}
                                            size={4}
                                            classNameLabel={"d-block text-truncate enquiryLabelClassName"}
                                            className={"form__input border-0 form-control-lg"}
                                        />
                                    </Col>
                                    <Col sm={12} md={4}>
                                        <InputItem
                                            name={"middleName"}
                                            title={"Father Name"}
                                            form={form}
                                            size={4}
                                            classNameLabel={"d-block text-truncate enquiryLabelClassName"}
                                            className={"form__input border-0 form-control-lg"}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                        <Row className="mb-2">
                            <Col sm={12} md={3}>
                                <InputItem
                                    name={"houseNo"}
                                    title={"Address(House no.)"}
                                    form={form}
                                    classNameLabel={"d-block text-truncate enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={9}>
                                <InputItem
                                    name={"address1"}
                                    title={"Building/Street"}
                                    form={form}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col sm={12} md={3}>
                                <InputItem
                                    name={"address2"}
                                    title={"Area/Road name"}
                                    form={form}
                                    size={3}
                                    classNameLabel={"enquiryLabelClassName d-block text-truncate"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={9}>
                                <InputItem
                                    name={"landmark"}
                                    title={"Landmark"}
                                    form={form}
                                    size={9}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"pincode"}
                                    title={"Pincode"}
                                    form={form}
                                    size={4}
                                    type={"number"}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"city"}
                                    title={"City"}
                                    form={form}
                                    size={4}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"state"}
                                    title={"State"}
                                    form={form}
                                    size={4}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col sm={12} md={4}>
                                <Label
                                    name={"dateOfBirth"}
                                    title="Date of Birth"
                                    form={form}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                                <Controller
                                    name="dateOfBirth"
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
                                                />
                                            </div>
                                            {<ErrorMessage error={errors?.dateOfBirth} />}
                                        </>
                                    )}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <GenderSelection control={control} name={"gender"} classNameLabel={"enquiryLabelClassName"} />
                            </Col>
                        </Row>
                        <FooterContainer text="Next" currentPage={1} />
                    </Form>
                </div>
            </div>
        </Container>
    );
});

export default Enquiry;

const GenderSelection = ({ control, name }) => {
    return (
        <Form.Group as={Col} md="8">
            <Form.Label className="enquiry-label enquiryLabelClassName">Gender</Form.Label>
            <div className="d-flex align-items-center mt-2">
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Form.Check
                            {...field}
                            type="radio"
                            id="male"
                            label="Male"
                            value="male"
                            checked={field.value === "male"}
                            onChange={(e) => field.onChange(e.target.value)}
                            style={{ marginRight: "3%" }}
                            className="radio_check_box d-flex"
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
                            id="female"
                            label="Female"
                            value="female"
                            checked={field.value === "female"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={"radio_check_box d-flex"}
                        />
                    )}
                />
            </div>
        </Form.Group>
    );
};

export const CustomDatePicker = forwardRef((props, ref) => {
    const datePickerRef = React.createRef();
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 1;
    const years = Array.from({ length: endYear - startYear }, (_, index) => startYear + index);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useImperativeHandle(ref, () => ({
        focus: () => {
            datePickerRef.current.setOpen(true);
        },
    }));

    return (
        <DatePicker
            style={{ backgroundColor: "#000000" }}
            ref={datePickerRef}
            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="datepicker-header" style={{ width: "100%", margin: "10px 0", display: "flex", justifyContent: "space-between" }}>
                    <button style={{ widht: "10%" }} type="button" className="datepicker-navigation" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        {"<"}
                    </button>
                    <select className="datepicker-year-select" value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        className="datepicker-month-select"
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button style={{ widht: "10%" }} className="datepicker-navigation" type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        {">"}
                    </button>
                </div>
            )}
            {...props}
        />
    );
});
