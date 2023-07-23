import { Outlet, useLocation } from "react-router-dom";

import "./style.scss";
import { CustomNav } from "../Master";

const Exam = () => {
    const { pathname } = useLocation();

    return (
        <>
            {pathname.includes("edit-exam") ? (
                ""
            ) : (
                <div className="d-flex justify-content-center mt-3 tab__container" style={{ backgroundColor: "#fff" }}>
                    <CustomNav path={"/exam/schedule-exam"} name="Schedule exam" />
                    <CustomNav path={"/exam/exam-report"} name="Exam Report" />
                </div>
            )}
            <Outlet />
        </>
    );
};

export default Exam;
