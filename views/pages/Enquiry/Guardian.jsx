import { Row, Col, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { isEqual, cloneDeep } from "lodash";

import "./style.scss";
import { FooterContainer } from "../../../components/Enquiry";
import CustomSelect from "../../../components/shared/options/CustomSelect";
import { defaultGuardianValues, defaultSiblingValues } from "../../../utils/constants/api/defaultValue";
import { InputItem } from "../../../components/shared/forms";
import plus_icon from "../../../assets/images/Enquiry_form/plus_icon.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "../../../utils/constants/validation/validation";
import { OPTIONS } from "../../../utils/constants/option-menu";
import { REGEX } from "../../../utils/constants/validation/regex";
import { actions } from "../../../redux/store";
import { setFormValues } from "../../../utils/constants/api/formData";
import { useEffect, useState } from "react";
import { appendIntoFormData } from "../../../utils/constants/api/formData";
import { useCreateEnquiryMutation } from "../../../api/enquiry";
import moment from "moment";
import { useUpdateAdmissionMutation } from "../../../api/admission";
import { showErrorToast } from "../../../utils/constants/api/toast";

const GuardianDetail = (props) => {
    const navigate = useNavigate();
    const [admissionConfirmCheckbox, setadmissionConfirmCheckbox] = useState(true);

    let { guardianData, personalData, educationData } = useSelector((state) => state.enquiry);
    const { enquiryNumber, studentId, schoolId, isStudentConfirmed } = useSelector((state) => state.enquiry);

    const [enquiryApi, { isLoading, error }] = useCreateEnquiryMutation();
    const [enquiryUpdateApi, { isLoading: isEnquiryUpdating }] = useUpdateAdmissionMutation();

    const [isFirstTime, setIsFirstTime] = useState(true);

    const form = useForm({
        defaultValues: defaultGuardianValues,
        resolver: yupResolver(Validation.GUARDIAN_FORM),
    });

    const { control, watch, handleSubmit, setValue, register, getValues } = form;

    const {
        fields,
        append: appendSibling,
        remove: removeSibling,
    } = useFieldArray({
        control,
        name: "siblings",
    });
    const formData = watch();

    useEffect(() => {
        if (isFirstTime || isEqual(guardianData, formData)) return;

        const updatedFormData = cloneDeep(formData); // cloning depply formData
        actions.enquiry.addGuardianData(updatedFormData); // storing cloned data into redux
    }, [formData, guardianData, isFirstTime]);

    useEffect(() => {
        if (!guardianData || !isFirstTime) return; // Not found Enquiry OR Not updating the first Time it returns
        setFormValues(guardianData, setValue);
        setIsFirstTime(false);
    }, [guardianData, isFirstTime, setValue]);

    useEffect(() => {
        error && showErrorToast(error?.data?.message || error || "Something Went wrong!");
    }, [error]);

    const handleAddSibling = () => appendSibling(defaultSiblingValues);
    const handleRemoveSibling = (index) => removeSibling(index);

    const handleContactChange = (e, name) => {
        if (REGEX.MOBILE.test(e.target.value)) return;
        setValue(name, e.target.value);
    };

    const onSubmit = async (data) => {
        personalData = {
            ...personalData,
            subjects: null,
            [schoolId?.id !== "NEW_SCHOOL" ? "schoolId" : "school"]: schoolId?.id !== "NEW_SCHOOL" ? schoolId?.id : schoolId?.value,
            dateOfBirth: moment(personalData.dateOfBirth).format("DD/MM/YYYY"),
        };

        const payload = { ...personalData, ...educationData, ...data, enquiryNumber };

        const formData = appendIntoFormData(payload);

        const response = studentId ? await enquiryUpdateApi({ formData, studentId }) : await enquiryApi(formData);

        if ([200, 201, 202, "success", "Success"].includes(response?.data?.status)) {
            navigate(admissionConfirmCheckbox && !isStudentConfirmed ? "/admission" : "/dashboard");
            admissionConfirmCheckbox && !studentId && actions.enquiry.setStudentId(response?.data?.data?.studentId);
            actions.enquiry.setIsConfirmAdmission(admissionConfirmCheckbox);
        }
    };

    return (
        <Container className="guardain-container  pb-4 pb-md-4" fluid>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-2">
                    <div className="d-sm-block d-md-flex w-100">
                        <div style={{ width: "115px" }}>
                            <CustomFormSelect form={form} name="parentPrefix" options={OPTIONS.PREFIX} label="Prefix" className="w-100" />
                        </div>
                        <Row className="ms-0 ms-md-2 w-100">
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"parentLastName"}
                                    title={"Surname"}
                                    form={form}
                                    size={4}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"parentFirstName"}
                                    title={"First Name"}
                                    form={form}
                                    size={4}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                            <Col sm={12} md={4}>
                                <InputItem
                                    name={"parentMiddleName"}
                                    title={"Father Name"}
                                    form={form}
                                    size={4}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                            </Col>
                        </Row>
                    </div>
                </Row>
                <Row className="mb-2">
                    <Col sm={6}>
                        <div className="position-relative">
                            <div className="d-flex align-items-center ">
                                <InputItem
                                    title="Contact number 1"
                                    onInput={(e) => handleContactChange(e, "contact1")}
                                    name="contact1"
                                    form={form}
                                    classNameLabel={"enquiryLabelClassName"}
                                    className={"form__input border-0 form-control-lg"}
                                />
                                <div className="position-absolute ms-2 contact_number_checkbox_position">
                                    <Controller
                                        control={control}
                                        name={`smsOn1`}
                                        render={({ field }) => (
                                            <Form.Check
                                                type="checkbox"
                                                disabled={!getValues("contact1")}
                                                checked={["true", true].includes(field.value)}
                                                onChange={(e) => field.onChange(e.target.checked ? "true" : "false")}
                                                className="m-0 p-0 mt-2 contact_number_checkbox"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="position-relative">
                            <InputItem
                                title="Contact number 2"
                                onInput={(e) => handleContactChange(e, "contact2")}
                                name="contact2"
                                form={form}
                                classNameLabel={"enquiryLabelClassName"}
                                className={"form__input border-0 form-control-lg"}
                            />
                            <div className="position-absolute contact_number_checkbox_position">
                                <Controller
                                    control={control}
                                    name={`smsOn2`}
                                    render={({ field }) => (
                                        <Form.Check
                                            type="checkbox"
                                            disabled={!getValues("contact2")}
                                            checked={["true", true].includes(field.value)}
                                            onChange={(e) => field.onChange(e.target.checked ? "true" : "false")}
                                            className="m-0 p-0 mt-2 contact_number_checkbox"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <InputItem
                        label="Occupation"
                        name="occupation"
                        form={form}
                        classNameLabel={"enquiryLabelClassName"}
                        className={"form__input border-0 form-control-lg"}
                    />
                </Row>
                <Row>
                    <Col className="text-center position-relative">
                        <h2 className="middle-header">
                            Sibling Details
                            <span style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "20px" }}>(optional)</span>
                            <div className="position-absolute top-50 end-0 translate-middle-y ">
                                <button type="button" className="Sibling_details_add_icon" onClick={handleAddSibling}>
                                    <img src={plus_icon} className="" alt="" />
                                </button>
                            </div>
                        </h2>
                    </Col>
                </Row>
                <Row className="mb-4">
                    {fields.map((sibling, index) => {
                        return (
                            <div key={sibling.id}>
                                <div className="d-sm-block d-md-flex w-100">
                                    <div style={{ width: "115px" }}>
                                        <CustomSelect
                                            form={form}
                                            name={`siblings.${index}.siblingPrefix`}
                                            options={OPTIONS.PREFIX}
                                            title="Prefix"
                                            {...register(`siblings.${index}.siblingPrefix`)}
                                            field={register(`siblings.${index}.siblingPrefix`)}
                                            className="w-100"
                                        />
                                    </div>
                                    <Row className="w-100 ms-0 ms-md-2">
                                        <Col sm={12} md={4}>
                                            <InputItem
                                                name={`siblings.${index}.siblingLastName`}
                                                title="Surname"
                                                form={form}
                                                size={4}
                                                classNameLabel={"enquiryLabelClassName"}
                                                className={"form__input border-0 form-control-lg"}
                                            />
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <InputItem
                                                name={`siblings.${index}.siblingFirstName`}
                                                title="First Name"
                                                form={form}
                                                size={4}
                                                classNameLabel={"enquiryLabelClassName"}
                                                className={"form__input border-0 form-control-lg"}
                                            />
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <InputItem
                                                name={`siblings.${index}.siblingMiddleName`}
                                                title="Father Name"
                                                form={form}
                                                size={4}
                                                classNameLabel={"enquiryLabelClassName"}
                                                className={"form__input border-0 form-control-lg"}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="d-flex">
                                    <Row className="w-100 mt-2">
                                        <Col sm={12} lg={6}>
                                            <InputItem
                                                title="Contact number 1"
                                                type="number"
                                                name={`siblings.${index}.siblingContact1`}
                                                form={form}
                                                classNameLabel={"enquiryLabelClassName"}
                                                className={"form__input border-0 form-control-lg"}
                                            />
                                        </Col>
                                        <Col sm={12} lg={6}>
                                            <div className="p-0 m-0">
                                                <Form.Label className="w-100 enquiryLabelClassName text-start">
                                                    Study here
                                                    <Controller
                                                        control={control}
                                                        name={`siblings.${index}.studyHere`}
                                                        render={({ field }) => (
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={["true", true].includes(field.value)}
                                                                onChange={(e) => field.onChange(e.target.checked ? "true" : "false")}
                                                                className="check_box_wrapper contact_number_checkbox m-0 p-0 mt-2"
                                                            />
                                                        )}
                                                    />
                                                </Form.Label>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="mt-5 mb-1 ms-2 ">
                                        <button type="button" className="remove_button" onClick={() => handleRemoveSibling(index)}>
                                            -
                                        </button>
                                    </div>
                                </div>
                                <hr className="border border-dark border-1 mt-3" />
                            </div>
                        );
                    })}
                </Row>
                <Row>
                    <Form.Group className="d-flex justify-content-center">
                        <Form.Label className="guardian-label">
                            Confirm Admission
                            <Form.Check
                                type="checkbox"
                                id="admissionConfirmCheckbox"
                                className="checkbox-center guardian-check contact_number_checkbox"
                                placeholder="Confirm Admission"
                                onChange={(e) => setadmissionConfirmCheckbox(e.target.checked)}
                                checked={admissionConfirmCheckbox}
                            />
                        </Form.Label>
                    </Form.Group>
                </Row>
                <FooterContainer text="Submit" currentPage={3} isLoading={isLoading || isEnquiryUpdating} />
            </Form>
        </Container>
    );
};

export default GuardianDetail;

export const CustomFormSelect = ({ form, name, options, label }) => {
    const { register } = form;
    return <CustomSelect title={label} {...register(name)} field={register(name)} form={form} options={options} className="w-100" />;
};

export const resetEnquiryStore = () => {
    const { resetMobileNumber, resetPersonalData, resetEducationData, resetGuardianData, resetEnquiryNumber } = actions.enquiry;
    const { setIsUpdatingEnquiry, setIsStudentConfirmed } = actions.enquiry;
    resetMobileNumber();
    resetEnquiryNumber();
    resetPersonalData();
    resetEducationData();
    resetGuardianData();
    setIsUpdatingEnquiry(false);
    setIsStudentConfirmed(false);
};
