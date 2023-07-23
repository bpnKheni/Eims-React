import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { format, getMonth, isSameDay, parse } from "date-fns";

import "./style.scss";
import SelectMonths from "../../../components/shared/SelectMonths/SelectMonths";
import { useGetStudentAttendanceQuery } from "../../../api/studentAttendance";
import { isValidArray } from "../../../utils/constants/validation/array";

const StudentAttendance = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [totalCountAttendance, setTotalCountAttendance] = useState([]);

    const studentId = JSON.parse(localStorage.getItem("STUDENT_DETAIL"));

    const { data: studentAttendanceResponse, isFetching: isFetchingStudentAttendance } = useGetStudentAttendanceQuery(studentId?.studentId);

    useEffect(() => {
        if (isFetchingStudentAttendance || studentAttendanceResponse?.status !== 200) return;
        handleMonthChange();
    }, [studentAttendanceResponse, isFetchingStudentAttendance]);

    const handleMonthChange = useCallback(
        (month = new Date()) => {
            setSelectedMonth(month);
            const dateMonth = format(month, "MMMM");
            const dateYear = month?.getFullYear(month);

            const matchResMonthAndManualMonth = studentAttendanceResponse?.response.filter(
                (item) => dateMonth === item?.monthNames && dateYear == item?.year && item
            );

            setTotalCountAttendance(matchResMonthAndManualMonth);
        },
        [studentAttendanceResponse]
    );

    return (
        <div>
            <Container className="overflow-x-hidden" style={{ height: "calc(100vh - 367px)", overflow: "auto" }}>
                <Row className="mx-auto">
                    <Col sm={12} md={6}>
                        <div className="h-100">
                            <div className="">
                                <div className="mt-2 mx-auto d-block w-100" style={{ height: "348px" }}>
                                    {selectedMonth && (
                                        <BigCalendar data={totalCountAttendance[0]?.data} selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
                                    )}
                                </div>
                            </div>
                            <div className="px-3 mt-4">
                                {totalCountAttendance?.map((item, index) => {
                                    return (
                                        <Row key={item?.presentDay + index}>
                                            <Col>
                                                <div className="Attendance_details_PresentDays">
                                                    <p className="fs-5 py-3 p-0 m-0 px-2">
                                                        <span className="fs-3">{item?.data?.presentDay}</span> <br />
                                                        Present days
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="Attendance_details_Absents">
                                                    <p className="fs-5 py-3 p-0 m-0">
                                                        <span className="fs-3">{item?.data?.absentDaysCount}</span> <br />
                                                        Absents
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="Attendance_details_Holidays">
                                                    <p className="fs-5 py-3 p-0 m-0">
                                                        <span className="fs-3">{item?.data?.holidayCount}</span> <br />
                                                        Holidays
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={6} className="pt-2 my-auto d-flex">
                        <div className="d-flex flex-wrap justify-content-center">
                            <SelectMonths selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StudentAttendance;

export const BigCalendar = (props) => {
    const { selectedMonth, onMonthChange, data } = props || {};
    const { holidays, absentDays } = data || {};
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

    return (
        <div className="big-calendar mx-auto">
            <div className="calendar-header">
                <button className="prev-month fs-4 border-0 bg-transparent" onClick={handlePrevMonth}>
                    &#8249;
                </button>
                <div className="text-center">
                    <span className="calendar_title ">Attendance of</span> <br />
                    <p className="fw-bold"> {selectedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
                </div>
                <button className="next-month fs-4 border-0 bg-transparent" onClick={handleNextMonth}>
                    &#8250;
                </button>
            </div>
            <div className="week-names mt-2">
                {weekDays.map((day) => (
                    <div className="week-name fw-bold " key={day}>
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
                    const currentMonth = getMonth(selectedMonth);
                    const currentYear = selectedMonth?.getFullYear();
                    const isHoliday = checkIsArrayIncludes({ arrayOfDates: holidays, currentMonth, currentYear, day });
                    const isAbsent = checkIsArrayIncludes({ arrayOfDates: absentDays, currentMonth, currentYear, day });

                    return (
                        <div className={`fw-medium ${isHoliday ? "text-danger" : isAbsent ? "absent__badge" : ""}`} key={day}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// finds the if the date is included in the holidays array
const checkIsArrayIncludes = ({ arrayOfDates, currentYear, currentMonth, day }) => {
    return (
        isValidArray(arrayOfDates) &&
        arrayOfDates?.some((date) => {
            const parsedHoliday = parse(date, "dd/MM/yyyy", new Date());
            return isSameDay(parsedHoliday, new Date(currentYear, currentMonth, day));
        })
    );
};
