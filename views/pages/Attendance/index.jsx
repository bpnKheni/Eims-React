import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import "../../styles/attendance.scss";
import { handleFormTitle } from "../../../utils/constants/helper/handleFormTitle";
import { CustomNav } from "../Master";

const AttendanceWrapper = () => {
    const { pathname } = useLocation();

    const title = useMemo(() => handleFormTitle(pathname), [pathname]);

    return (
        <>
            <div>
                <div className="tab__container d-flex justify-content-center">
                    <CustomNav path="/attendance/take-attendance" name="Take Attendance" />
                    <CustomNav path="/attendance/check-attendance" name="Check Attendance" />
                </div>
                <Col className="text-center">{title}</Col>
                <div className="takeAttendance_scroll">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AttendanceWrapper;
