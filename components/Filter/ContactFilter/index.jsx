import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";
import "../../../views/pages/StudentContacts/style.scss";

const ContactFilter = forwardRef((props, ref) => {
    const { isFormVisible, setIsFormVisible, filterConditionObj } = props;
    return (
        <div className="position-absolute end-0 ContactFilter p-2 rounded-3 d-flex flex-column align-items-center" style={{ zIndex: "5", width: "400px" }}>
            <Form className="w-100">
                <Form.Control placeholder="Alphabet wise" className="filter_input shadow-none" />
                <Form.Control placeholder="Roll number wise" className="filter_input mt-2 shadow-none" />
                <button className="mx-auto d-block my-3 submit_button px-3 py-2 fs-5">Apply</button>
            </Form>
        </div>
    );
});

export default ContactFilter;
