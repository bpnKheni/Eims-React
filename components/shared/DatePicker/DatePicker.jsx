import moment from "moment";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";

import { useController } from "react-hook-form";
import dateIcon from "../../../assets/images/Attendance/dateIcon.svg";

export const DatePickerField = ({ control, name, label, ...rest }) => {
    const {
        field: { ref, value, onChange, onBlur },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <div>
            <DatePicker
                onChange={(date) => {
                    onChange(date);
                }}
                onBlur={onBlur}
                selected={value || null}
                dateFormat="dd/MM/yyyy"
                ref={ref}
                {...rest}
            />
            {error && <span>{error.message}</span>}
        </div>
    );
};

export const RangeDate = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const StartDateCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="custom_DateButton_style" onClick={onClick} ref={ref}>
            {value || "Select Start Date"}
        </button>
    ));

    const EndDateCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="custom_DateButton_style" onClick={onClick} ref={ref}>
            {value || "Select end Date"}
        </button>
    ));

    return (
        <div className="d-flex">
            <DatePicker showIcon selected={startDate} onChange={(date) => setStartDate(date)} customInput={<StartDateCustomInput />} />
            <DatePicker showIcon={<img src={dateIcon} />} selected={endDate} onChange={(date) => setEndDate(date)} customInput={<EndDateCustomInput />} />
        </div>
    );
};
