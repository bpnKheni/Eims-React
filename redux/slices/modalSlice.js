import { createSlice } from "@reduxjs/toolkit";

const open = true;
const emptyObj = {
    open: false,
    data: null,
};
const handlePayload = ({ payload: data }) => ({
    open,
    data,
});

const initialState = {
    standard: emptyObj,
    shift: emptyObj,
    batch: emptyObj,
    delete: emptyObj,
    mobile: emptyObj,
    admission: emptyObj,
    password: emptyObj,
    staffAttendance: emptyObj,
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openStandard: (state, action) => {
            state.standard = handlePayload(action);
        },
        openSubject: (state, action) => {
            state.subject = handlePayload(action);
        },
        openShift: (state, action) => {
            state.shift = handlePayload(action);
        },
        openBatch: (state, action) => {
            state.batch = handlePayload(action);
        },
        openDelete: (state, action) => {
            state.delete = handlePayload(action);
        },
        openMobile: (state, action) => {
            state.mobile = handlePayload(action);
        },
        openAdmission: (state, action) => {
            state.admission = handlePayload(action);
        },
        openPassword: (state, action) => {
            state.password = handlePayload(action);
        },
        openStaffAttendance: (state, action) => {
            state.staffAttendance = handlePayload(action);
        },
        closeStandard: (state) => {
            state.standard = emptyObj;
        },
        closeSubject: (state) => {
            state.subject = emptyObj;
        },
        closeShift: (state) => {
            state.shift = emptyObj;
        },
        closeBatch: (state) => {
            state.batch = emptyObj;
        },
        closeDelete: (state) => {
            state.delete = emptyObj;
        },
        closeMobile: (state) => {
            state.mobile = emptyObj;
        },
        closeAdmission: (state) => {
            state.admission = emptyObj;
        },
        closePassword: (state) => {
            state.password = emptyObj;
        },
        closeStaffAttendance: (state) => {
            state.staffAttendance = emptyObj;
        },
    },
});

export const {
    openStandard,
    openSubject,
    openShift,
    openBatch,
    openDelete,
    openMobile,
    openAdmission,
    openPassword,
    openStaffAttendance,
    closeStandard,
    closeSubject,
    closeShift,
    closeBatch,
    closeDelete,
    closeMobile,
    closeAdmission,
    closePassword,
    closeStaffAttendance,
} = modalSlice.actions;

export default modalSlice.reducer;
