import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Table from "../../../components/shared/Table";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { useGetExamQuery } from "../../../api/exam";
import { actions } from "../../../redux/store";
import "./style.scss";

const ScheduleExam = () => {
    const [expandedNote, setExpandedNote] = useState(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    };

    const { data: examResponse, isFetching } = useGetExamQuery(null, { refetchOnMountOrArgChange: true });

    const handleExamEdit = (e, exam) => {
        navigate(`/exam/schedule-exam/edit-exam/${exam._id}`, { state: { examData: exam } });
    };
    const handleExamDelete = (e, id) => {
        actions.modal.openDelete({ id, type: "EXAM" });
    };

    const columns = [
        {
            name: "actions",
            label: "Edit&Delete",
            renderer: (exam) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <EditAndDelete onEdit={(e) => handleExamEdit(e, exam)} onDelete={(e) => handleExamDelete(e, exam._id)} />
                </div>
            ),
        },
        {
            name: "number",
            label: "No",
            renderer: (_, index) => index + 1,
        },
        { name: "standard", label: "Standard" },
        {
            name: "date",
            label: "Date",
        },
        { name: "subject", label: "Subject" },
        { name: "totalMarks", label: "Total Marks" },
        {
            name: "notes",
            label: "Notes",
            renderer: (item, itemIndex) => {
                return (
                    <div className="text-wrap mx-auto d-block" style={{ width: "200px" }}>
                        {expandedNote === itemIndex ? <span>{item.notes}</span> : <span title={item.notes}>{truncateText(item.notes, 20)}</span>}
                        {item.notes.length > 50 && (
                            <button
                                onClick={() => setExpandedNote(expandedNote === itemIndex ? null : itemIndex)}
                                style={{
                                    marginLeft: "0.5rem",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    border: "none",
                                    background: "none",
                                }}
                            >
                                {expandedNote === itemIndex ? "Less" : "More"}
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {pathname === "/exam/schedule-exam" ? (
                <>
                    <div className="border border-dark overflow-auto" style={{ height: "calc(100vh - 225px)", overflow: "auto" }}>
                        <Table items={examResponse?.data} columns={columns} className="exam_table_width" />
                    </div>
                    <div className="position-fixed bottom-0 end-0 p-3">
                        <IoIosAddCircle onClick={() => navigate("/exam/schedule-exam/create-exam")} size={62} style={{ color: "#3660F8", cursor: "pointer" }} />
                    </div>
                </>
            ) : (
                <></>
            )}
            <Outlet />
        </>
    );
};

export default ScheduleExam;

// const scheduleExam = [
//     {
//         no: "1",
//         standard: "12",
//         date: "02/10/2023",
//         subject: "English",
//         totalMarks: "45",
//         notes: "1,2,3,4",
//     },
// ];

{
    /* <div className="border border-dark mt-4 text-align-center">
{isLoading ? <p>Loading...</p> : <Table columns={columns} items={examResponse.data} />}
</div>
<div className="position-fixed bottom-0 end-0 p-3">
<IoIosAddCircle onClick={() => navigate("/exam/create-exam")} size={62} style={{ color: "#3660F8", cursor: "pointer" }} />
</div> */
}
