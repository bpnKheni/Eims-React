import { Button, Modal, Form, FormGroup, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { BiRefresh } from "react-icons/bi";

import "./style.scss";
import { actions } from "../../../../redux/store";
import { REGEX } from "../../../../utils/constants/validation/regex";
import { Validation } from "../../../../utils/constants/validation/validation";
import { defaultEducationalValues, defaultGuardianValues, defaultMobileNumber, defaultPersonalValues } from "../../../../utils/constants/api/defaultValue";
import { InputItem } from "../../forms";
import { useRegisterMobileMutation } from "../../../../api/common";
import { isValidArray } from "../../../../utils/constants/validation/array";
import { useNavigate } from "react-router-dom";

const MobileModal = () => {
    const navigate = useNavigate();
    const { open } = useSelector((state) => state?.modal?.mobile || "");

    const [registerMobileReq, registerMobile] = useRegisterMobileMutation();

    const form = useForm({
        defaultValues: { MobileNumber: "" },
        resolver: yupResolver(Validation.MOBILE),
    });

    const {
        setValue,
        reset,
        handleSubmit,
        formState: { errors },
    } = form;

    const validateMobileNumber = (e, name) => {
        const phoneNumber = e.target.value;
        if (!REGEX.MOBILE.test(phoneNumber)) return;
        else setValue(name, phoneNumber);
    };

    const handleRegister = async (data) => {
        const response = await registerMobileReq(data);

        if (response?.data?.student) {
            actions.enquiry.addMobileNumber(data?.MobileNumber);
            handleEnquiryFormData(response?.data?.student);
            actions.enquiry.setStudentId("");
            reset();
        }
    };

    const handleClose = () => {
        actions.modal.closeMobile();
        navigate("/dashboard");
        reset();
    };

    return (
        <Modal show={open} onHide={handleClose} animation={true} centered backdrop="static" keyboard={false} size="md">
            <Modal.Header className="modal__title__wrapper " closeButton>
                <h2 className="modal__title">Add Mobile Number</h2>
            </Modal.Header>
            <Modal.Body
                className="bg-white"
                style={{
                    borderBottomRightRadius: "20px",
                    borderBottomLeftRadius: "20px",
                }}
            >
                <Form onSubmit={handleSubmit(handleRegister)} className="d-flex flex-column">
                    <div className="input-with-icons my-2">
                        <InputItem
                            title="Mobile Number"
                            className="form__input"
                            classNameLabel="enquiryLabelClassName"
                            name="MobileNumber"
                            form={form}
                            onInput={(e) => validateMobileNumber(e, "MobileNumber")}
                        />
                        {/* <BiRefresh className="refresh-icon" onClick={reset} /> */}
                    </div>

                    <FormGroup className="mb-2 text-center" controlId="exampleForm.ControlInput3">
                        <Button className="btn btn-lg form__button text-white" type="submit" disabled={registerMobile?.isLoading}>
                            {registerMobile?.isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </FormGroup>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MobileModal;

export const handleEnquiryFormData = (apiResponse) => {
    console.log("apiRespons<><><<<>><><>", apiResponse);
    let defaultPersonalVal = { ...defaultPersonalValues };
    let defaultEducationalVal = { ...defaultEducationalValues };
    let defaultGuardianVal = { ...defaultGuardianValues };

    Object.entries(apiResponse).forEach(([key, value]) => {
        if (key in defaultPersonalVal) {
            defaultPersonalVal[key] = value;
        } else if (key in defaultEducationalVal) {
            defaultEducationalVal[key] = value;
        } else if (key in defaultGuardianVal) {
            let extractedData = value;
            if (key === "siblings") {
                extractedData =
                    isValidArray(apiResponse?.siblings) &&
                    apiResponse?.siblings?.map((sibling) => ({
                        siblingContact1: sibling?.siblingContact1,
                        siblingLastName: sibling?.lastName,
                        siblingMiddleName: sibling?.middleName,
                        siblingPrefix: sibling?.prefix,
                        siblingFirstName: sibling?.firstName,
                        studyHere: sibling?.studyHere,
                    }));
            }
            defaultGuardianVal[key] = extractedData;
        }
    });

    actions.enquiry.addPersonalData(defaultPersonalVal);
    actions.enquiry.addEducationData(defaultEducationalVal);
    actions.enquiry.addGuardianData(defaultGuardianVal);
};
