import { useState, useEffect, useRef } from "react";
import { addDays, format, getMonth, isSameDay, parse } from "date-fns";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

import "../StudentRecords/style.scss";
import "./style.scss";
import { CardLayout } from "../../../components/layouts/CardLayout";
import { Label, ErrorMessage, InputItem } from "../../../components/shared/forms";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { formatDate } from "../../../utils/constants/formats/dates";
import { useCreateHolidayMutation, useGetHolidaysQuery } from "../../../api/holidays";
import { showErrorToast } from "../../../utils/constants/api/toast";
import { Validation } from "../../../utils/constants/validation/validation";
import { yupResolver } from "@hookform/resolvers/yup";

const Holiday = () => {
    const datePickerRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const [holidayData, setHolidayData] = useState([]);

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Disable past dates
    const maxDate = new Date(today.getFullYear() + 1, 11, 31);

    const { data: holidayResponse, isFetching } = useGetHolidaysQuery(null, { refetchOnMountOrArgChange: true });
    const [createHolidayReq, { isLoading, error, isError }] = useCreateHolidayMutation();

    console.log("holidayResponse >>>>> ", holidayResponse);

    const form = useForm({
        defaultValues: { date: addDays(new Date(), 1), name: "" },
        resolver: yupResolver(Validation.HOLIDAY),
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

    useEffect(() => {
        if (holidayResponse?.status !== 200) return;
        setHolidayData(holidayResponse?.data);
    }, [holidayResponse]);

    useEffect(() => {
        if (!error) return;
        showErrorToast(error?.data?.message || "Something Went Wrong");
    }, [error]);

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleSubmitHoliday = async (data) => {
        console.log("payload data >>>>> ", data);
        const payload = { ...data, date: formatDate({ date: data?.date }) };
        const response = await createHolidayReq(payload);
        console.log("response >>>> ", response);
        reset();
    };

    return (
        <Row style={{ width: "100%", height: "calc(100vh - 100px)" }} className="my-auto py-3 overflow-auto">
            <Col sm={12} md={6} lg={6} className=" border-sm-none border-end border-1 border-dark">
                <h3>Holidays</h3>
                <div style={{ height: "345px" }}>
                    <BigCalendar selectedMonth={selectedMonth} holiday={holidayData} onMonthChange={handleMonthChange} />
                </div>
                <Container>
                    <div style={{ marginTop: "30px" }}>
                        <CardLayout>
                            <div className="p-3 overflow-y-auto pb-5" style={{ height: "35vh" }}>
                                <h4 className="fw-medium p-0 m-0 text-dark">Holidays List</h4>
                                {holidayData?.map((holiday, idx) => {
                                    const parsedDate = parse(holiday?.date, "dd/MM/yyyy", new Date());
                                    const formattedDate = format(parsedDate, "MMMM dd, yyyy");
                                    return (
                                        <div key={`${(holiday?.name + idx).toString()}`}>
                                            <p className="text-muted p-0 m-0 mt-3">{formattedDate || ""}</p>
                                            <p className="fs-5 p-0 m-0 pb-2" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.30)" }}>
                                                {holiday?.name || ""}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardLayout>
                    </div>
                </Container>
            </Col>
            <Col sm={12} md={6} lg={6} className="d-block my-auto mt-4 mt-md-auto">
                <Container>
                    <CardLayout>
                        <Form onSubmit={handleSubmit(handleSubmitHoliday)} style={{ padding: "10px" }}>
                            <h4 style={{ textAlign: "center" }}>Add Holiday</h4>
                            <Label name={"date"} title="Date" form={form} classNameLabel={"admissionLabel text-dark fs-6"} />
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
                                                minDate={minDate}
                                                maxDate={maxDate}
                                                onChange={(date) => {
                                                    onChange(date);
                                                }}
                                                className="bg-white border-bottom rounded-0 border-dark"
                                            />
                                        </div>
                                        {<ErrorMessage error={errors?.addmissionDate} />}
                                    </>
                                )}
                            />
                            <InputItem name="name" form={form} className="holiDay_name border-0 border-bottom rounded-0 border-dark shadow-none" />
                            <button disabled={isLoading} className="submit_button fs-4 fw-bold mx-auto d-block px-5 py-2">
                                Add
                            </button>
                        </Form>
                    </CardLayout>
                </Container>
            </Col>
        </Row>
    );
};

export default Holiday;

export const BigCalendar = (props) => {
    // const { selectedMonth, onMonthChange, holiday } = props || {};

    // const HolidayDates = holiday?.map((item) => item.date);
    const { selectedMonth = new Date(), onMonthChange = () => {}, holiday = [] } = props || {};

    const HolidayDates = holiday?.map((item) => item.date);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    const firstDayOfMonth = monthStart.getDay();
    const totalDays = monthEnd.getDate();

    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Generate an array of days for the selected month
    const days = Array.from({ length: totalDays }, (_, index) => index + 1);

    const handlePrevMonth = () => {
        const prevMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
        onMonthChange(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
        onMonthChange(nextMonth);
    };

    const isSunday = (year, month, day) => {
        const date = new Date(year, month, day);
        return date.getDay() === 0;
    };

    return (
        <div className="big-calendar holiday-big-calendar mx-auto">
            <div className="holiday-calendar-header">
                <div className="calendar-header align-items-center px-5 ">
                    <button className="prev-month fs-4 border-0 bg-transparent fw-bold" onClick={handlePrevMonth}>
                        &#8249;
                    </button>
                    <div className="">
                        <p className="text-center p-0 m-0  fs-5">{selectedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
                    </div>
                    <button className="next-month fs-4 border-0 bg-transparent fw-bold" onClick={handleNextMonth}>
                        &#8250;
                    </button>
                </div>
            </div>
            <div className="weeks_and_dates">
                <div className="week-names mt-2">
                    {weekDays.map((day, index) => (
                        <div className={`week-name fw-bold fs-6 ${index === 0 ? "text-danger" : ""}`} key={day}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar-body">
                    {Array(firstDayOfMonth)
                        .fill("")
                        .map((_, index) => (
                            <div className="empty-date" key={`empty-${index}`} />
                        ))}
                    {days.map((day) => {
                        const currentMonth = selectedMonth.getMonth();
                        const currentYear = selectedMonth.getFullYear();
                        const formattedDate = format(new Date(currentYear, currentMonth, day), "dd/MM/yyyy");
                        const isHoliday = HolidayDates.includes(formattedDate);
                        const isSunday1 = isSunday(currentYear, currentMonth, day);

                        return (
                            <div
                                key={day}
                                className={`calendar-day fw-semibold ${isHoliday && !isSunday1 ? "absent__badge" : ""} ${isSunday1 ? "text-danger" : ""}`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// finds the if the date is included in the holidays array
// const checkIsArrayIncludes = ({ arrayOfDates, currentYear, currentMonth, day }) => {
//     return (
//         isValidArray(arrayOfDates) &&
//         arrayOfDates?.some((date) => {
//             const parsedHoliday = parse(date, "dd/MM/yyyy", new Date());
//             return isSameDay(parsedHoliday, new Date(currentYear, currentMonth, day));
//         })
//     );
// };
