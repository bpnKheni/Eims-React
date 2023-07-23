import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ExamWrapper from "./views/pages/Exam";

const Enquiry = lazy(() => import("./views/pages/Enquiry/Enquiry"));
const Admission = lazy(() => import("./views/pages/Admission"));
const EducationalDetail = lazy(() => import("./views/pages/Enquiry/Educational"));
const GuardianDetail = lazy(() => import("./views/pages/Enquiry/Guardian"));
const Dashboard = lazy(() => import("./views/pages/Dashboard"));
const Staff = lazy(() => import("./views/pages/Staff"));
const StaffAttendance = lazy(() => import("./views/pages/StaffAttendance"));
const Accounts = lazy(() => import("./views/pages/Accounts"));
const Noticeboard = lazy(() => import("./views/pages/Noticeboard"));
const CreateNotice = lazy(() => import("./views/pages/Noticeboard/CreateNotice"));
const StudentContacts = lazy(() => import("./views/pages/StudentContacts"));
const Leave = lazy(() => import("./views/pages/Leave"));
const Holiday = lazy(() => import("./views/pages/Holiday"));
const TimeTable = lazy(() => import("./views/pages/TimeTable"));
const EnquiryWrapper = lazy(() => import("./views/pages/Enquiry"));
const StudentRecords = lazy(() => import("./views/pages/StudentRecords"));
const StudentDetails = lazy(() => import("./views/pages/StudentRecords/StudentDetails"));
const PersonalDetails = lazy(() => import("./views/pages/StudentRecords/PersonalDetails"));
const StudentAttendance = lazy(() => import("./views/pages/StudentRecords/StudentAttendance"));
const ProgressReport = lazy(() => import("./views/pages/StudentRecords/ProgressReport"));
const CheckAttendance = lazy(() => import("./views/pages/Attendance/CheckAttendance"));
const TakeAttendance = lazy(() => import("./views/pages/Attendance/TakeAttendance"));
const AttendanceWrapper = lazy(() => import("./views/pages/Attendance"));
const MainLayout = lazy(() => import("./components/layouts/MainLayout"));
const CreateUpdateStaff = lazy(() => import("./views/pages/Staff/CreateUpdateStaff"));
const Login = lazy(() => import("./views/pages/Login"));
const Master = lazy(() => import("./views/pages/Master"));
const Standard = lazy(() => import("./views/pages/Master/Standard"));
const Subject = lazy(() => import("./views/pages/Master/Subject"));
const Shift = lazy(() => import("./views/pages/Master/Shift"));
const Batch = lazy(() => import("./views/pages/Master/Batch"));
const StandardAndSubject = lazy(() => import("./views/pages/Master/StdAndSub"));
const CreateUpdateExam = lazy(() => import("./views/pages/Exam/CreateUpdateExam"));
const ScheduleExam = lazy(() => import("./views/pages/Exam/ScheduleExam"));
const ExamReport = lazy(() => import("./views/pages/Exam/ExamReport"));

const RouterWrapper = () => {
    function generateRoutes(routes) {
        return routes.map((route, index) => {
            const { path, element, children } = route;
            return (
                <Route key={index} path={path} element={element}>
                    {children && children.length > 0 && generateRoutes(children)}
                </Route>
            );
        });
    }
    return (
        <MainLayout>
            <Routes>{generateRoutes(routeConfig)}</Routes>
        </MainLayout>
    );
};

export default RouterWrapper;

function DefaultForm() {
    const location = useLocation();

    return <div>Default Form Component</div>;
}

const routeConfig = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/enquiry",
        element: <EnquiryWrapper />,
        children: [
            {
                index: true,
                path: "/enquiry/form-first",
                element: <Enquiry />,
            },
            {
                path: "/enquiry/form-second",
                element: <EducationalDetail />,
            },
            {
                path: "/enquiry/form-third",
                element: <GuardianDetail />,
            },
            {
                path: "/enquiry/*",
                element: <DefaultForm />,
            },
        ],
    },
    {
        path: "/admission",
        element: <Admission />,
    },
    {
        path: "/staff",
        element: <Staff />,
    },
    {
        path: "/create-staff",
        element: <CreateUpdateStaff />,
    },
    {
        path: "/update-staff/:staffId",
        element: <CreateUpdateStaff />,
    },
    {
        path: "/staff_attendance",
        element: <StaffAttendance />,
    },
    {
        path: "/accounts",
        element: <Accounts />,
    },
    {
        path: "/noticeboard",
        element: <Noticeboard />,
    },
    {
        path: "/create-notice",
        element: <CreateNotice />,
    },
    {
        path: "/edit-notice/:noticeId",
        element: <CreateNotice />,
    },
    {
        path: "/exam",
        element: <ExamWrapper />,
        children: [
            {
                path: "/exam/schedule-exam",
                element: <ScheduleExam />,
                children: [
                    {
                        index: true,
                        path: "/exam/schedule-exam/create-exam",
                        element: <CreateUpdateExam />,
                    },
                    {
                        path: "/exam/schedule-exam/edit-exam/:examId",
                        element: <CreateUpdateExam />,
                    },
                ],
            },
            {
                path: "/exam/exam-report",
                element: <ExamReport />,
            },
        ],
    },
    {
        path: "/attendance",
        element: <AttendanceWrapper />,
        children: [
            {
                index: true,
                path: "/attendance/take-attendance",
                element: <TakeAttendance />,
            },
            {
                path: "/attendance/check-attendance",
                element: <CheckAttendance />,
            },
            {
                path: "/attendance/*",
                element: <DefaultForm />,
            },
        ],
    },
    {
        path: "/student_contacts",
        element: <StudentContacts />,
    },
    {
        path: "/student-records",
        element: <StudentRecords />,
    },
    {
        path: "/student-records/student-details",
        element: <StudentDetails />,
        children: [
            {
                path: "/student-records/student-details/personal-details",
                element: <PersonalDetails />,
            },
            {
                path: "/student-records/student-details/student-attendance",
                element: <StudentAttendance />,
            },
            {
                path: "/student-records/student-details/progress-report",
                element: <ProgressReport />,
            },
        ],
    },
    {
        path: "/master",
        element: <Master />,
        children: [
            {
                index: true,
                path: "/master/standard",
                element: <Standard />,
            },
            {
                path: "/master/subject",
                element: <Subject />,
            },
            {
                path: "/master/shift",
                element: <Shift />,
            },
            {
                path: "/master/batch",
                element: <Batch />,
            },
            {
                path: "/master/standard-and-subject",
                element: <StandardAndSubject />,
            },
        ],
    },
    {
        path: "/leave",
        element: <Leave />,
    },
    {
        path: "/holiday",
        element: <Holiday />,
    },
    {
        path: "/time_table",
        element: <TimeTable />,
    },
    {
        path: "*",
        element: <Navigate replace="/dashboard" />,
    },
];

// {
//     /* <Route index element={<Login />} />
// <Route path="/login" element={<Login />} />

// <Route path="/dashboard" element={<Dashboard />} />

// <Route path="/enquiry" element={<EnquiryWrapper />}>
//     <Route index={true} path="/enquiry/form-first" element={<Enquiry />} />
//     <Route path="/enquiry/form-second" element={<EducationalDetail />} />
//     <Route path="/enquiry/form-third" element={<GuardianDetail />} />
//     <Route path="/enquiry/*" element={<DefaultForm />} />
// </Route>

// <Route path="/admission" element={<Admission />} />
// <Route path="/staff" element={<Staff />} />
// <Route path="/create-staff" element={<CreateUpdateStaff />} />
// <Route path="/update-staff/:staffId" element={<CreateUpdateStaff />} />
// <Route path="/staff_attendance" element={<StaffAttendance />} />

// <Route path="/accounts" element={<Accounts />} />
// <Route path="/noticeboard" element={<Noticeboard />} />
// <Route path="/create-notice" element={<CreateNotice />} />
// <Route path="/edit-notice/:noticeId" element={<CreateNotice />} />

// <Route path="/exam" element={<ExamWrapper />}>
//     <Route path="/exam/schedule-exam" element={<ScheduleExam />}>
//         <Route index={true} path="/exam/schedule-exam/create-exam" element={<CreateUpdateExam />} />
//         <Route path="/exam/schedule-exam/edit-exam/:examId" element={<CreateUpdateExam />} />
//     </Route>
//     <Route path="/exam/exam-report" element={<ExamReport />} />
// </Route>

// <Route path="/attendance" element={<AttendanceWrapper />}>
//     <Route index={true} path="/attendance/take-attendance" element={<TakeAttendance />} />
//     <Route path="/attendance/check-attendance" element={<CheckAttendance />} />
//     <Route path="/attendance/*" element={<DefaultForm />} />
// </Route>

// <Route path="/student_contacts" element={<StudentContacts />} />

// <Route path="/student-records" element={<StudentRecords />} />
// <Route path="/student-records/student-details" element={<StudentDetails />}>
//     <Route path="/student-records/student-details/personal-details" element={<PersonalDetails />} />
//     <Route path="/student-records/student-details/student-attendance" element={<StudentAttendance />} />
//     <Route path="/student-records/student-details/progress-report" element={<ProgressReport />} />
// </Route>

// <Route path="/master" element={<Master />}>
//     <Route index={true} path="/master/standard" element={<Standard />} />
//     <Route path="/master/subject" element={<Subject />} />
//     <Route path="/master/shift" element={<Shift />} />
//     <Route path="/master/batch" element={<Batch />} />
//     <Route path="/master/standard-and-subject" element={<StandardAndSubject />} />
// </Route>

// <Route path="/leave" element={<Leave />} />
// <Route path="/holiday" element={<Holiday />} />
// <Route path="/time_table" element={<TimeTable />} />

// <Route path="*" element={<Navigate replace="/dashboard" />} /> */
// }
