import { useMemo } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

import { actions } from "../../../../redux/store";
import { useDeleteStandardMutation } from "../../../../api/standard";
import { useDeleteSubjectMutation } from "../../../../api/subject";
import { useDeleteShiftMutation } from "../../../../api/shift";
import { useDeleteBatchMutation } from "../../../../api/batch";
import "./style.scss";
import { useDeleteAdmissionMutation } from "../../../../api/admission";
import { useDeleteStaffMutation } from "../../../../api/staff";
import { useDeleteExamMutation } from "../../../../api/exam";
import { useDeleteStudentContactMutation } from "../../../../api/studentContact";
import { useDeleteNoticeMutation } from "../../../../api/noticeboard";

const DeleteModal = ({ data }) => {
    const { id, type, confirmationMessage = "" } = data || {};
    const { open } = useSelector((state) => state?.modal?.delete || "");

    const [deleteReq, { isLoading }] = useDeleteStandardMutation();
    const [deleteSubjectReq, { isLoading: isDeletingSubject }] = useDeleteSubjectMutation();
    const [deleteShift, { isLoading: isDeletingShift }] = useDeleteShiftMutation();
    const [deleteBatch, { isLoading: isDeletingBatch }] = useDeleteBatchMutation();
    const [deleteAdmission, { isLoading: isDeletingAdmission }] = useDeleteAdmissionMutation();
    const [deleteStaff, { isLoading: isDeletingStaff }] = useDeleteStaffMutation();
    const [deleteExam, { isLoading: isDeletingExam }] = useDeleteExamMutation();
    const [deleteStudent, { isLoading: isDeletingStudent }] = useDeleteStudentContactMutation();
    const [deleteNotice, { isLoading: isDeletingNotice }] = useDeleteNoticeMutation();

    const deleteData = useMemo(() => {
        switch (type) {
            case "STANDARD":
                return { delete: deleteReq, loading: isLoading, message: "Standard" };
            case "SUBJECT":
                return {
                    delete: deleteSubjectReq,
                    loading: isDeletingSubject,
                    message: "Subject",
                };
            case "SHIFT":
                return {
                    delete: deleteShift,
                    loading: isDeletingShift,
                    message: "Shift",
                };
            case "BATCH":
                return {
                    delete: deleteBatch,
                    loading: isDeletingBatch,
                    message: "Batch",
                };
            case "ADMISSION":
                return {
                    delete: deleteAdmission,
                    loading: isDeletingAdmission,
                    message: "Admission",
                };
            case "STAFF":
                return {
                    delete: deleteStaff,
                    loading: isDeletingStaff,
                    message: "Staff",
                };
            case "EXAM":
                return {
                    delete: deleteExam,
                    loading: isDeletingExam,
                    message: "Exam",
                };
            case "NOTICE":
                return {
                    delete: deleteNotice,
                    loading: isDeletingNotice,
                    message: "Notice",
                };
            default:
                break;
        }
    }, [
        type,
        deleteReq,
        deleteSubjectReq,
        deleteShift,
        deleteBatch,
        deleteAdmission,
        deleteStaff,
        deleteNotice,
        isDeletingSubject,
        isLoading,
        isDeletingShift,
        isDeletingBatch,
        isDeletingAdmission,
        isDeletingStaff,
        isDeletingNotice,
    ]);

    const handleDelete = async () => {
        const response = await deleteData.delete(id);
        [200, 201, 202, "success", "Success"].includes(response?.data?.status) && toast.success(deleteData?.message + " Deleted Successfully");
        handleClose();
    };

    const handleClose = () => actions.modal.closeDelete();

    return (
        <Modal show={open} onHide={handleClose} animation={true} centered>
            <Modal.Body className="rounded rounded-5 bg-white edit_modal_width">
                <div className="w-100 d-flex justify-content-center m-auto  py-2 text-center">
                    <h3 className="delete_message">{`${confirmationMessage || `Are you sure you want to delete this ${deleteData?.message}?`}`}</h3>
                </div>
                <div className="d-flex">
                    <button type="button" onClick={handleDelete} disabled={deleteData?.loading} className="modal_save_button w-50 me-3">
                        Yes
                    </button>
                    <button type="button" onClick={handleClose} className="w-50 modal_close_button">
                        No
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteModal;
