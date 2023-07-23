import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { format, addDays, startOfWeek, startOfMonth, subDays, subMonths, addMonths, endOfWeek, eachDayOfInterval, getDay, parse } from "date-fns";

import "./style.scss";
import Table from "../../../components/shared/Table";
import { useGetStaffQuery } from "../../../api/staff";
import { isValidArray } from "../../../utils/constants/validation/array";
import { Loader } from "../../../components/shared/Loader";
import useErrorCatcher from "../../../utils/constants/hooks/useErrorCatcher";
import { actions } from "../../../redux/store";
import { useGetStaffAttendanceQuery } from "../../../api/staffAttendance";
import { formatDate } from "../../../utils/constants/formats/dates";
// import { useCreateStaffAttendanceMutation } from "../../../api/staffAttendance";

const StaffAttendance = () => {
    const { sunday, monday } = giveMondayAndSundayFromDate();
    const [startDate, setStartDate] = useState(monday);
    const [endDate, setEndDate] = useState(sunday);
    const [arrayOfWeek, setArrayOfWeek] = useState(generateArrayOfWeek({ monday, sunday }));
    const [monthStr, setMonthStr] = useState(handleMonthStr({ monday, sunday }));

    const [staffData, setStaffData] = useState([]);
    const [datesOfAbsentStaff, setDatesOfAbsentStaff] = useState(new Set());

    // console.log("startDate >>>>> ", startDate, " <<<<<< endDate >>>>>>> ", endDate);

    const { data: staffResponse, isFetching, isError: isFetchingStaffError, error: staffFetchingError } = useGetStaffQuery();
    const {
        data: staffAttendanceResponse,
        isFetching: isFetchingStaffAttendance,
        isError: isFetchingStaffAttendanceError,
        error: staffAttendanceFetchingError,
    } = useGetStaffAttendanceQuery(
        { startDate: formatDate({ date: startDate }), endDate: formatDate({ date: endDate }) },
        { refetchOnMountOrArgChange: true, skip: !startDate || !endDate }
    );

    useErrorCatcher({ isError: isFetchingStaffError, error: staffFetchingError });
    useErrorCatcher({ isError: isFetchingStaffAttendanceError, error: staffAttendanceFetchingError });

    // console.log("staffResponse >>>>> ", staffResponse, " <<<<<< staffAttendanceResponse >>>>> ", staffAttendanceResponse);
    // const [createStaffAttendance] = useCreateStaffAttendanceMutation();

    useEffect(() => {
        if (staffResponse?.status !== 200 || staffAttendanceResponse?.status !== 200) return;
        setStaffData(staffResponse?.data);

        let setOfDates = new Set();
        staffAttendanceResponse?.data?.forEach((attendanceDetails) => {
            const parsedDate = parse(attendanceDetails?.date, "dd/MM/yyyy", new Date());
            const absentDate = parsedDate.getDate();
            setOfDates.add(absentDate);
        });

        // console.log("setOfDates >>>>> ", setOfDates);
        setDatesOfAbsentStaff(setOfDates);
    }, [staffAttendanceResponse, staffResponse]);

    const handleDatesAndMonth = (givenDate) => {
        const { monday, sunday } = giveMondayAndSundayFromDate(givenDate);
        setStartDate(monday);
        setEndDate(sunday);
        setMonthStr(handleMonthStr({ sunday, monday }));
        setArrayOfWeek(generateArrayOfWeek({ sunday, monday }));
    };

    const scrollPrevious = () => handleDatesAndMonth(subDays(arrayOfWeek[0], 1));
    const scrollNext = () => handleDatesAndMonth(addDays(arrayOfWeek[arrayOfWeek.length - 1], 1));

    const scrollMonthPrevious = () => {
        const firstMonday = findFirstMondayOfPreviousMonth(startDate);
        handleDatesAndMonth(firstMonday);
    };

    const scrollMonthNext = () => {
        const firstMonday = findFirstMondayOfNextMonth(endDate);
        handleDatesAndMonth(firstMonday);
    };

    const handleOpenStaffAttendance = (data) => {
        // const { staffData, date } = data || {};
        // console.log("staffData >>>> ", staffData, " <<<<< date >>>>> ", date);
        actions.modal.openStaffAttendance(data);
    };

    const handleStaffAttendance = ({ staff, date }) => {
        if (!datesOfAbsentStaff.has(date)) return true;

        const absentStaffData = staffAttendanceResponse?.data?.find((staffData) => {
            const parsedDate = parse(staffData?.date, "dd/MM/yyyy", new Date());
            const absentDate = parsedDate.getDate();
            return absentDate === date;
        });

        const isStaffMatched = absentStaffData?.attendance?.some((staffData) => staffData?.staffId === staff._id);
        return !isStaffMatched ? true : false;
    };

    const renderTableContent = () => {
        const currentDate = new Date();

        return (
            isValidArray(arrayOfWeek) &&
            arrayOfWeek?.map((date, index) => {
                const dayOfMonth = date?.getDate();
                const isCurrentDate = date.toDateString() === currentDate.toDateString();
                const nameOfWeek = format(date, "eee");

                return {
                    name: `day-${dayOfMonth}`,
                    label: (
                        <div className={`calendar-header ${isCurrentDate ? "current_primary" : ""}`}>
                            {index === 0 && (
                                <div className="scroll-arrow" onClick={scrollPrevious}>
                                    &lt;
                                </div>
                            )}
                            <div className="calendar-date">
                                <div>{nameOfWeek || ""}</div>
                                <div>{dayOfMonth || ""}</div>
                            </div>
                            {index === arrayOfWeek.length - 1 && (
                                <div className="scroll-arrow" onClick={scrollNext}>
                                    &gt;
                                </div>
                            )}
                        </div>
                    ),
                    renderer: (staff) => {
                        // const arr = [3,5];
                        const isPresent = handleStaffAttendance({ staff, date: dayOfMonth });
                        // console.log("isPresent >>>> ", isPresent);
                        return (
                            <div className="pb-1">
                                <Form.Check
                                    type="checkbox"
                                    checked={isPresent}
                                    onClick={() => {
                                        handleOpenStaffAttendance({ staffData: staff, date, isPresent });
                                    }}
                                    onChange={(e) => {}}
                                    className="m-0 p-0 staffAttendance_checkbox"
                                />
                            </div>
                        );
                    },
                };
            })
        );
    };

    const columns = [
        { name: "number", label: "No", renderer: (_, index) => index + 1 },
        {
            name: "name",
            label: "Name",
            renderer: ({ name, surName }) => (
                <span>
                    {name || " "} {surName || ""}
                </span>
            ),
        },
        ...renderTableContent(),
    ];

    return (
        <div>
            <div className="mt-4 d-flex align-items-center">
                <div className="table-header">
                    <div className="scroll-month-container">
                        <div className="scroll-month-arrow" onClick={scrollMonthPrevious}>
                            &lt;
                        </div>
                        <div className="table-header-center align-self-center">{monthStr}</div>
                        <div className="scroll-month-arrow" onClick={scrollMonthNext}>
                            &gt;
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-content">
                <Table columns={columns} items={staffData} isLoading={isFetchingStaffAttendance || isFetching} />
            </div>
            <div className="d-flex justify-content-center ">
                <button type="submit" className="staff-button position-fixed bottom-0 p-2">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default StaffAttendance;

const findFirstMondayOfMonth = (month) => {
    const firstDayOfMonth = startOfMonth(month); // First day of the previous month
    const firstDayOfWeek = getDay(firstDayOfMonth);
    const offset = (8 - (firstDayOfWeek || 7)) % 7;
    const firstMonday = addDays(firstDayOfMonth, offset); // First Monday of the previous month
    return firstMonday;
};

const findFirstMondayOfPreviousMonth = (givenDate) => findFirstMondayOfMonth(subMonths(givenDate, 1)); // Passing Previous month;
const findFirstMondayOfNextMonth = (givenDate) => findFirstMondayOfMonth(addMonths(givenDate, 1)); // Passing Next month

const handleMonthStr = ({ monday, sunday }) => {
    const startMonth = monday?.toLocaleString("default", { month: "long" });
    const startYear = monday?.getFullYear();
    const endMonth = sunday?.toLocaleString("default", { month: "long" });
    const endYear = sunday.getFullYear();

    let monthStr;
    if (startMonth === endMonth && startYear === endYear) monthStr = `${startMonth} ${startYear}`;
    else if (startYear === endYear) monthStr = `${startMonth} - ${endMonth} ${startYear}`;
    else monthStr = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

    return monthStr;
};

const giveMondayAndSundayFromDate = (givenDate = new Date()) => {
    const monday = startOfWeek(givenDate, { weekStartsOn: 1 }); // Monday of the week
    const sunday = endOfWeek(givenDate, { weekStartsOn: 1 }); // Sunday of the week
    return { monday, sunday };
};

const generateArrayOfWeek = ({ monday, sunday }) => eachDayOfInterval({ start: monday, end: sunday });

// const formatSataffAttendancePayload = (staffResultArr) => {
//     // let responseArr = [];
//     // staffResultArr.forEach((staff) => {
//     //     if (!staff.isAbsent) {
//     //         responseArr.push({
//     //             ...staff,
//     //             staffId: staff._id,
//     //             isAbsent: staff.isAbsent,
//     //         });
//     //     } else {
//     //         console.log("absent student IDDDDDD >>>>>>>> ", staff?.isAbsent && staff?._id);
//     //     }
//     // });
//     // console.log("response array>>>>>>", responseArr);
//     // return isValidArray(responseArr) ? responseArr : [];
// };

// const onSubmitForm = async (data) => {
//     // const attendanceData = {
//     //     ...data,
//     //     date: format(selectedDate, "dd/MM/yyyy"),
//     //     staffAttendance: formatSataffAttendancePayload(data?.staffAttendance),
//     // };
//     // console.log("attendance data>>>>>", attendanceData);
//     // try {
//     //     const response = await createStaffAttendance(attendanceData);
//     //     console.log("Staff attendance created:", response.data);
//     // } catch (error) {
//     //     console.error("Error occurred while creating staff attendance:", error);
//     // }
// };
