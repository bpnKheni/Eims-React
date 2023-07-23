import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { endOfDay, isWithinInterval, parse, startOfDay } from "date-fns";

import "./style.scss";
import { useGetStdAndSubByStandardQuery } from "../../../api/standardAndSubject";
import { useGetResultReportQuery } from "../../../api/studentAttendance";
import { isValidArray } from "../../../utils/constants/validation/array";
import ProgressTable from "../../../components/shared/Table/ProgressTable";
import ProgressFilter from "../../../components/Filter/ProgressFilter";

const ProgressReport = () => {
    const [obj, setObj] = useState([]);
    const [subjectId, setSubjectId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { studentId, standardId } = JSON.parse(localStorage.getItem("STUDENT_DETAIL"));

    const { progressFilterObj } = useSelector((state) => state?.utils);
    const { lastFewExamFrom, lastFewExamTo, startDate, endDate } = progressFilterObj;

    const handleFilterButtonClick = () => setIsFormVisible(!isFormVisible);

    const { data: subjectsFromStandard } = useGetStdAndSubByStandardQuery(standardId, {
        refetchOnMountOrArgChange: true,
        skip: !standardId,
    });

    const {
        data: examReportResponse,
        error: examReportError,
        isFetching: isFetchingExamReport,
    } = useGetResultReportQuery(
        {
            studentId,
            subjectId: subjectId || "", // Empty string to omit subjectId when null
        },
        { skip: !studentId, refetchOnMountOrArgChange: true }
    );

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(examReportResponse?.status)) return;
        setObj(examReportResponse.data);
        if (startDate && endDate) {
            setObj((prevData) => handleProgressFilter(prevData, startDate, endDate));
        }
        if (lastFewExamFrom && lastFewExamTo) {
            setObj((prevData) => handleProgressFilterLastFewExam(prevData, lastFewExamFrom, lastFewExamTo));
        }
    }, [examReportResponse, progressFilterObj]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <p className="fs-4 p-0 m-0">Select Subject</p>
                </div>
                <div className="position-relative">
                    <button className="border-0 p-2 rounded-3" onClick={handleFilterButtonClick}>
                        <FaFilter size={23} />
                    </button>
                    <div className="overLay w-100 mt-2">
                        {isFormVisible && <ProgressFilter isFormVisible={isFormVisible} setIsFormVisible={() => setIsFormVisible(!isFormVisible)} />}
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between flex-nowrap text-truncate">
                <button className={`subject_select_button fs-6 ${!subjectId ? "subject_select_button_active" : ""}`} onClick={() => setSubjectId("")}>
                    All
                </button>
                {isValidArray(subjectsFromStandard) &&
                    subjectsFromStandard?.map((item) => (
                        <button
                            key={item?.subjectId}
                            onClick={() => {
                                setSubjectId(item?.subjectId);
                            }}
                            className={`subject_select_button fs-6 text-truncate ${subjectId === item?.subjectId ? "subject_select_button_active" : ""}`}
                        >
                            {item?.sub}
                        </button>
                    ))}
            </div>

            {isFetchingExamReport ? (
                <p>Loading progress report...</p>
            ) : examReportError ? (
                <p>Error occurred while fetching progress report.</p>
            ) : obj ? (
                <ProgressTable progressData={obj} className="w-100 border border-dark text-center my-3" />
            ) : (
                <p>No progress data available.</p>
            )}
            <button className="mx-auto d-block Download_Report_Button px-3 fs-5">Download Report</button>
        </div>
    );
};

export default ProgressReport;

const handleProgressFilter = (data, startDate, endDate) => {
    const { subjects } = data;

    // Map over the subjects and apply the filtering on each subject's data
    const filteredSubjects = subjects?.map((item) => {
        const compare = item?.data?.filter(({ date }) => {
            return isWithinInterval(parse(date, "dd/MM/yyyy", new Date()), { start: startOfDay(startDate), end: endOfDay(endDate) });
        });
        return { ...item, data: compare }; // Update the subject's data with the filtered result
    });

    return { ...data, subjects: filteredSubjects }; // Update the original data with the filtered subjects
};

const handleProgressFilterLastFewExam = (data, lastFewExamFrom, lastFewExamTo) => {
    const { subjects } = data;

    // Map over the subjects and apply the filtering on each subject's data
    const filteredSubjects = subjects?.map((item) => {
        const compare = item?.data?.filter(({ testNumber }) => {
            // Check if the test number is within the selected range (lastFewExamFrom to lastFewExamTo)
            const isWithinTestNumberRange = testNumber >= lastFewExamFrom && testNumber <= lastFewExamTo;
            return isWithinTestNumberRange;
        });
        return { ...item, data: compare }; // Update the subject's data with the filtered result
    });

    return { ...data, subjects: filteredSubjects }; // Update the original data with the filtered subjects
};
