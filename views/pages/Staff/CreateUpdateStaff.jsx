import React, { Fragment, useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";

import "./style.scss";
import { InputItem, Label } from "../../../components/shared/forms";
import { Validation } from "../../../utils/constants/validation/validation";
import { defaultStaffValue } from "../../../utils/constants/api/defaultValue";
import { OPTIONS } from "../../../utils/constants/option-menu";
import { REGEX } from "../../../utils/constants/validation/regex";
import { ModifiedSelect } from "../../../components/shared/options/CustomSelect";
import DatePicker from "react-datepicker";
import { useCreateStaffMutation, useUpdateStaffMutation, useUpdateStaffPasswordMutation } from "../../../api/staff";
import pluseIcon from "../../../assets/images/Enquiry_form/plus_icon.svg";
import { actions } from "../../../redux/store";
import { useSelector } from "react-redux";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import { roleSelectStyle, staffSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import SubjectSelect from "../../../components/shared/options/SubjectSelect";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { useGetStandardAndSubjectQuery } from "../../../api/standardAndSubject";
import { isValidArray } from "../../../utils/constants/validation/array";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";

const CreateUpdateStaff = () => {
    const { staffId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const passwordStr = useSelector((state) => state.utils.passwordStr);

    const [subjectOptionsForAllStd, setSubjectOptionsForAllStd] = useState([]);

    const isEditMode = !!staffId || false;
    const { data: stdAndSubjectResponse, isFetching } = useGetStandardAndSubjectQuery(null, { refetchOnMountOrArgChange: true });
    const [createStaff, { isLoading: createLoading, error: createStaffError, isError: isCreateError }] = useCreateStaffMutation();
    const [updateStaff, { isLoading: updateLoading, error: updateStaffError, isError: isUpdateError }] = useUpdateStaffMutation();
    useErrorCatcher({ error: createStaffError, isError: isCreateError }), useErrorCatcher({ error: updateStaffError, isError: isUpdateError });

    const prefillData = state?.staffData || null;

    const form = useForm({
        defaultValues: defaultStaffValue,
        resolver: yupResolver(Validation.STAFF_FORM),
    });

    const {
        setValue,
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = form;
    const formData = watch();

    const {
        fields,
        append: appendStdAndSub,
        remove: removeStdAndSub,
    } = useFieldArray({
        control,
        name: "standardSubject",
    });

    const handleAddStdAndSub = () => appendStdAndSub({ standardId: "", subjectId: "" });

    const handleRemoveStdAndSub = (index) => {
        removeStdAndSub(index);
    };

    const handleContactChange = (e, name) => {
        const mobileNumberPattern = REGEX.MOBILE;
        const phoneNumber = e.target.value;

        if (!mobileNumberPattern.test(phoneNumber)) return;
        else setValue(name, phoneNumber);
    };

    const onSubmitForm = async (data) => {
        const formattedDateOfBirth = moment(data.dateOfBirth).format("DD/MM/YYYY");
        const body = {
            ...data,
            dateOfBirth: formattedDateOfBirth,
            standardSubject: handleStandardSubjectPayload(data?.standardSubject),
        };

        const response = !isEditMode ? await createStaff(body) : await updateStaff({ ...body, staffId });

        if ([200, 201, 202, "success", "Success"].includes(response?.data?.status)) {
            navigate("/staff");
            reset();
        }
    };

    // Pre-fill the form with the prefillData
    useEffect(() => {
        if (!prefillData || !isEditMode) return;

        // Set the rest of the values
        Object.keys(defaultStaffValue).forEach((key) => {
            setValue(key, prefillData[key] || "");
        });

        const selectedDate = prefillData?.dateOfBirth ? moment(prefillData?.dateOfBirth, "DD/MM/YYYY").toDate() : null;

        setValue("fatherName", prefillData?.middleName);
        setValue("dateOfBirth", selectedDate);
        setValue("landmark", prefillData?.landmark ?? "");
        setValue("standardSubject", prefillData?.staffStandardSubject);
        setValue("isActive", prefillData?.isActive || false); // boolean
    }, [prefillData, setValue]);

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

    const openPasswordModal = () => actions.modal.openPassword();

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
        <div>
            {/* <h3 className={`${isEditMode ? "edit-button" : "staff-header"}`>{isEditMode ? "Edit" : "Teacher"}</h3> */}
            <h3 className={`mb-4 mt-3 ${isEditMode ? "edit-button" : "staff-header"}`}>{isEditMode ? "Edit" : "Teacher"}</h3>
            <Container className="staff-container" fluid>
                <Form onSubmit={handleSubmit(onSubmitForm)}>
                    <Row className="mb-2">
                        <div className="d-md-flex w-100">
                            <ModifiedSelect
                                title={"Prefix"}
                                control={control}
                                name="prefix"
                                form={form}
                                options={OPTIONS.PREFIX}
                                costumeLabelStyle={"staff_label"}
                                costumeSelectStyle={staffSelectStyle}
                            />
                            <Row className="w-100 mt-3 mt-md-0 ms-md-2">
                                <Col sm={12} md={4}>
                                    <InputItem
                                        name={"surName"}
                                        title={"Surname"}
                                        form={form}
                                        size={4}
                                        className="staff_input_style"
                                        classNameLabel="staff_label"
                                    />
                                </Col>
                                <Col sm={12} md={4}>
                                    <InputItem
                                        name={"name"}
                                        title={"First Name"}
                                        form={form}
                                        size={4}
                                        className="staff_input_style"
                                        classNameLabel={"staff_label"}
                                    />
                                </Col>
                                <Col sm={12} md={4}>
                                    <InputItem
                                        name={"fatherName"}
                                        title={"Father Name"}
                                        form={form}
                                        size={4}
                                        className="staff_input_style"
                                        classNameLabel={"staff_label"}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={3}>
                            <InputItem
                                name={"address"}
                                title={"Address(House no.)"}
                                form={form}
                                className="staff_input_style "
                                classNameLabel={"staff_label d-block text-truncate"}
                            />
                        </Col>
                        <Col sm={9}>
                            <InputItem
                                name={"building"}
                                title={"Building/Street"}
                                form={form}
                                size={9}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={12} md={6}>
                            <InputItem
                                name={"area"}
                                title={"Area/Road name"}
                                form={form}
                                size={6}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                        <Col sm={12} md={6}>
                            <InputItem name={"landmark"} form={form} size={6} className="staff_input_style" classNameLabel={"staff_label"} />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={12} md={6}>
                            <InputItem
                                title="Contact number 1"
                                onInput={(e) => handleContactChange(e, "contact1")}
                                name="contact1"
                                type="number"
                                form={form}
                                size={6}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                        <Col sm={12} md={6}>
                            <InputItem
                                title="Contact number 2"
                                onInput={(e) => handleContactChange(e, "contact2")}
                                name="contact2"
                                type="number"
                                form={form}
                                size={6}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={12} md={6} style={{ height: "114px" }}>
                            <Label name="dateOfBirth" title="Date of Birth" form={form} classNameLabel={"staff_label"} />
                            <Controller
                                control={control}
                                name="dateOfBirth"
                                render={({ field: { value, onChange } }) => (
                                    <div className="datepicker-container">
                                        <CustomDatePicker
                                            placeholderText="Select date"
                                            onChange={(date) => onChange(date)}
                                            selected={value}
                                            showPopperArrow={false}
                                            shouldCloseOnSelect={false}
                                            className="staff_input_style"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                )}
                            />
                        </Col>
                        <Col sm={12} md={6} style={{ height: "114px" }}>
                            <InputItem size={6} form={form} name={"email"} title={"Email"} className="staff_input_style" classNameLabel={"staff_label"} />
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm={12} md={6}>
                            <InputItem
                                name={"qualification"}
                                title={"Qualification"}
                                form={form}
                                size={6}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                        <Col sm={12} md={6}>
                            <InputItem
                                name={"designation"}
                                title={"Designation"}
                                form={form}
                                size={6}
                                className="staff_input_style"
                                classNameLabel={"staff_label"}
                            />
                        </Col>
                    </Row>

                    {formData?.role !== "Clerk" && (
                        <div className="position-relative mb-2">
                            {fields.map((stdAndSub, index) => {
                                return (
                                    <Fragment key={stdAndSub.id}>
                                        <div className="position-relative">
                                            <Row style={{ padding: "10px 0px 0px 0px" }}>
                                                <Col sm={12} md={6} style={{ height: "114px" }}>
                                                    <Label name="Standard" title="Standard" classNameLabel={"staff_label"} />
                                                    <Controller
                                                        control={control}
                                                        name={`standardSubject.${index}.standardId`}
                                                        render={({ field: { onChange, value } }) => (
                                                            <>
                                                                <StandardSelect
                                                                    defaultStandard={value || stdAndSub?.standardId}
                                                                    styles={roleSelectStyle}
                                                                    handleChange={(selectedOption) => onChange(selectedOption || null)}
                                                                />
                                                                {errors[`standardSubject${index}.standardId`] && (
                                                                    <ErrorMessage error={errors[`standardSubject${index}.standardId`]} />
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                </Col>
                                                <Col sm={12} md={6} style={{ height: "114px" }}>
                                                    <ModifiedSelect
                                                        title={"Subject"}
                                                        control={control}
                                                        name={`standardSubject.${index}.subjectId`}
                                                        form={form}
                                                        options={handleSubjectsOptionsAsPerStd(watch(`standardSubject.${index}.standardId`))}
                                                        costumeLabelStyle={"staff_label"}
                                                        costumeSelectStyle={roleSelectStyle}
                                                    />
                                                </Col>
                                            </Row>
                                            <div className="position-absolute end-0 top-0">
                                                {index > 0 && (
                                                    <button className="remove_button" type="button" onClick={() => handleRemoveStdAndSub(index)}>
                                                        -
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            })}
                            <button className="position-absolute top-0 end-0 border-0 bg-transparent" type="button" onClick={handleAddStdAndSub}>
                                <img src={pluseIcon} alt="Plus Icon" />
                            </button>
                        </div>
                    )}

                    {isEditMode ? (
                        <Row className="mb-2">
                            <Col sm={12} md={6} style={{ height: "114px" }}>
                                <ModifiedSelect
                                    control={control}
                                    name="role"
                                    title="Role"
                                    form={form}
                                    options={OPTIONS.ROLE}
                                    defaultValue="teacher"
                                    costumeLabelStyle={"staff_label"}
                                    costumeSelectStyle={roleSelectStyle}
                                    className=""
                                />
                            </Col>
                            <Col sm={12} md={6} style={{ height: "114px" }}>
                                <InputItem
                                    name={"salary"}
                                    title={"Salary"}
                                    form={form}
                                    type="text"
                                    className="staff_input_style"
                                    classNameLabel={"staff_label"}
                                />
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <Row className="mb-2">
                                <Col sm={12} md={6} style={{ height: "114px" }}>
                                    <ModifiedSelect
                                        control={control}
                                        name="role"
                                        title="Role"
                                        form={form}
                                        options={OPTIONS.ROLE}
                                        defaultValue="teacher"
                                        costumeLabelStyle={"staff_label"}
                                        costumeSelectStyle={roleSelectStyle}
                                        className=""
                                    />
                                </Col>
                                <Col sm={12} md={6} style={{ height: "114px" }}>
                                    <InputItem
                                        name={"salary"}
                                        title={"Salary"}
                                        form={form}
                                        type="number"
                                        className="staff_input_style"
                                        classNameLabel={"staff_label"}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                    <Row className="mb-2 align-items-center">
                        {isEditMode ? (
                            ""
                        ) : (
                            <Col lg={6}>
                                <InputItem
                                    name={"password"}
                                    title={"password"}
                                    form={form}
                                    type="password"
                                    className="staff_input_style"
                                    classNameLabel={"staff_label"}
                                />
                            </Col>
                        )}
                        <Col lg={6} className={isEditMode ? "mt-3" : ""}>
                            <div className="d-flex justify-content-between">
                                <Form.Label className="d-flex justify-content-between staff_label" htmlFor="custom-switch">
                                    <p>Enable/Disable</p>{" "}
                                </Form.Label>
                                <Controller
                                    control={control}
                                    name={"isActive"}
                                    render={({ field }) => (
                                        <Form.Check
                                            id="custom-switch"
                                            {...field}
                                            type="switch"
                                            className="switch_style shadow-none"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        {isEditMode ? (
                            <button type="button" onClick={openPasswordModal} className="password_button">
                                {isEditMode ? "Edit Password" : "Create password"}
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button disabled={isFetching || updateLoading || createLoading} type="submit" className="staff-button">
                            {isEditMode ? (updateLoading ? "Loading" : "Update") : createLoading ? "Loading" : "Save"}
                        </button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default CreateUpdateStaff;

export const formatSubjectOptions = ({ subjects }) => isValidArray(subjects) && subjects?.map((item) => ({ value: item?.subjectId, label: item?.sub }));

const handleStandardSubjectPayload = (data) => {
    data = data?.filter(({ standardId, subjectId }) => {
        return !standardId || !subjectId ? false : true;
    });

    return data;
};
