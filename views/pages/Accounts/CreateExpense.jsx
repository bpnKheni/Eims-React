import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import "./style.scss";
import { NavLink, useLocation } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../components/shared/options/styles/styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputItem, Label, ErrorMessage } from "../../../components/shared/forms";
import { GoPlus } from "react-icons/go";
import DatePicker from "react-datepicker";
import "../../styles/app.scss";
import { Validation } from "../../../utils/constants/validation/validation";
import { actions } from "../../../redux/store";

const CreateExpense = () => {
    const location = useLocation();
    const isCreateMode = location.pathname === "/accounts/create-expense";
    const form = useForm({
        defaultValues: {
            name: "",
            category: "",
            rollno: "",
            batch: "",
            date: "",
            description: "",
        },
        resolver: yupResolver(Validation.ACCOUNT_FORM),
    });
    const { control } = form;

    const handleOpen = (e, data = { open: true, data: null }) => {
        actions.modal.openExpense({ ...data, open: true });
    };

    return (
        <MainLayout>
            {isCreateMode ? (
                <div className="d-flex justify-content-center mt-3 tab__container" style={{ backgroundColor: "#fff" }}>
                    <NavLink to="/accounts/fees" className={({ isActive }) => (isActive ? "menu active__menu" : "menu")}>
                        Fees
                    </NavLink>
                    <NavLink to="/accounts/create-expense" className={({ isActive }) => (isActive ? "menu active__menu" : "menu")}>
                        Expense
                    </NavLink>
                </div>
            ) : (
                <h3 className="edit-button">Edit</h3>
            )}
            <Container fluid className="mt-3 account-container">
                <Form noValidate>
                    <Row className="mb-2">
                        <InputItem name={"name"} title={"First Name"} form={form} size={6} />

                        <Col lg={6} className={"mb-2 mb-lg-0 "}>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <Label title={"Category type"} />
                                <GoPlus size={22} className="ml-2" style={{ color: "rgba(0, 0, 0, 0.5)" }} onClick={() => handleOpen()} />
                            </div>
                            <Select placeholder="Please Select" styles={customStyles} name="category" />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <InputItem name={"rollno"} title={"Roll No"} form={form} size={4} />
                        <InputItem name={"batch"} title={"Batch"} form={form} size={4} />
                        <Col sm={12} lg={4}>
                            <Label name="date" title="Date" form={form} />
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
                                        />
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>

                    <Row className="mt-5 mt-lg-0">
                        <InputItem name={"description"} title={"Description"} form={form} size={12} />
                    </Row>
                </Form>
            </Container>
            {isCreateMode ? (
                <div className="d-flex justify-content-center align-items-end">
                    <div className="position-fixed bottom-0">
                        <button className="staff-button m-2">Save</button>
                        <button className="staff-button m-2 ">Reset</button>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-center ">
                    <button className="staff-button position-fixed bottom-0 p-2">Update</button>
                </div>
            )}
        </MainLayout>
    );
};

export default CreateExpense;
