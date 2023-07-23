import { BrowserRouter as Router } from "react-router-dom";
import { Fragment, Suspense, lazy, useEffect, useLayoutEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import "./views/styles/app.scss";
const Auth = lazy(() => import("./components/Auth"));
const RouterWrapper = lazy(() => import("./Routes"));
const DeleteModal = lazy(() => import("./components/shared/modals/delete"));
const SubjectModal = lazy(() => import("./components/shared/modals/subject"));
const ShiftModal = lazy(() => import("./components/shared/modals/shift"));
const BatchModal = lazy(() => import("./components/shared/modals/batch"));
const MobileModal = lazy(() => import("./components/shared/modals/mobile"));
const AdmissionModal = lazy(() => import("./components/shared/modals/admission"));
const StandardModal = lazy(() => import("./components/shared/modals/standard"));
const StaffAttendanceModal = lazy(() => import("./components/shared/modals/staffAttendance"));
import { Loader } from "./components/shared/Loader";
import PasswordModal from "./components/shared/modals/password";

function App() {
    const modal = useSelector((state) => state?.modal);
    // console.log("modal >>>>> ", modal);

    return (
        <Fragment>
            <Router>
                <Suspense fallback={<Loader />}>
                    <Auth />

                    {/* ROUTER WRAPPER COMPONENT */}
                    <RouterWrapper />
                </Suspense>

                {/* MODAL COMPONENT */}
                <Suspense fallback={<Loader />}>
                    {modal?.standard?.open && <StandardModal data={modal?.standard?.data} />}
                    <SubjectModal data={modal?.subject?.data} />
                    <ShiftModal data={modal?.shift?.data} />
                    {modal?.batch?.data?.open && <BatchModal data={modal?.batch?.data} />}
                    {<MobileModal data={modal?.mobile?.data} />}
                    {modal?.admission?.open && <AdmissionModal data={modal?.admission?.data} />}
                    <DeleteModal data={modal?.delete?.data} />
                    {modal?.password?.open && <PasswordModal data={modal?.password?.data} />}
                    {modal.staffAttendance?.open && <StaffAttendanceModal data={modal?.staffAttendance?.data} />}
                </Suspense>
            </Router>

            {/* GLOBAL TOASTER COMPONENT */}
            <ToastContainer newestOnTop={true} autoClose={2500} icon={true} />
        </Fragment>
    );
}

export default App;
