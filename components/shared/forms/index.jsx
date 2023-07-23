import { forwardRef, Fragment, memo } from "react";
import { BiErrorAlt } from "react-icons/bi";

import "../../../views/styles/_forms.scss";
import "../../../components/Enquiry/style.scss";
import { Col, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

export const BaseInputItem = forwardRef(({ id, title, error, element, autoComplete, className, classNameLabel, as, rows, form, ...props }, ref) => {
    const InputElement = element || Form.Control;
    const isRequired = error?.type === "required";

    return (
        <Form.Group as={Col} {...props} className="form-group">
            <Form.Label className={`${classNameLabel}`} htmlFor={id}>
                {capitalize?.(title)}
                {error?.message && isRequired && <span style={{ color: "#FF0000" }}>*</span>}
            </Form.Label>
            {as === "textarea" ? (
                <Form.Control as="textarea" className={`${className} ${error ? "form__input_invalid" : ""}`} id={id} {...props} ref={ref} rows={rows} />
            ) : (
                <InputElement className={`${className} ${error ? "form__input_invalid" : ""}`} type="text" id={id} {...props} ref={ref} as={as} />
            )}
            <ErrorMessage error={error} />
        </Form.Group>
    );
});

export const InputItem = forwardRef(
    ({ name, title = capitalize(name), form, element, autoComplete, required, onInput, size, as, initialValue, ...inputProps }, ref) => {
        const { errors } = form.formState;
        const registerOpts = initialValue
            ? {
                  value: initialValue,
              }
            : {};
        return (
            <BaseInputItem
                form={form}
                id={name}
                title={title}
                size={size}
                error={errors[name]}
                element={element}
                onInput={onInput}
                {...inputProps}
                {...(form.register(name, registerOpts) || "")}
                as={as}
            />
        );
    }
);

export const ErrorMessage = memo(({ error, className }) => {
    return (
        <div
            className={`form__msg form__msg_invalid ${className || ""} ${error ? "form__msg_visible" : ""}`}
            style={{
                fontSize: "12px",
                fontWeight: "500",
            }}
        >
            <p className="d-flex align-items-center mt-auto">
                {error?.message && <BiErrorAlt className={`mt-1 ${error ? "form__msg_visible" : ""}`} />}
                <span className="ms-1 mt-1 text-danger">{error?.message}</span>
            </p>
        </div>
    );
});

export const FormRow = ({ children }) => <div className="form__row">{children}</div>;

export const FormColumn = ({ children }) => <div className="form__col">{children}</div>;

export const FormItem = ({ children }) => <div className="form__item">{children}</div>;

export const HeaderTitle = ({ title, variant }) => {
    const Header = variant || "h1";
    return (
        <Header
            style={{
                display: "block",
                margin: "auto 0",
            }}
        >
            {title}
        </Header>
    );
};

export const Label = ({ title, htmlFor, classNameLabel }) => {
    return (
        <Form.Label className={`${classNameLabel} text-nowrap`} htmlFor={htmlFor}>
            {capitalize?.(title)}
            {/* {error?.message && isRequired && <span style={{ color: "#FF0000" }}>*</span>} */}
        </Form.Label>
    );
};
