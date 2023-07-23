import _ from "lodash";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import modalReducer, { modalSlice } from "./slices/modalSlice";
import authReducer, { authSlice } from "./slices/authSlice";
import enquiryReducer, { enquirySlice } from "./slices/enquirySlice";
import studentReducer, { studentSlice } from "./slices/studentSlice";
import utilsReducer, { utilsSlice } from "./slices/utilsSlice";

import { authApi } from "../api/auth";
import { standardApi } from "../api/standard";
import { subjectApi } from "../api/subject";
import { shiftApi } from "../api/shift";
import { batchApi } from "../api/batch";
import { standardAndSubjectApi } from "../api/standardAndSubject";
import { admissionApi } from "../api/admission";
import { commonApi } from "../api/common";
import { schoolApi } from "../api/school";
import { enquiryApi } from "../api/enquiry";
import { studentApi } from "../api/student";
import { staffApi } from "../api/staff";
import { accountApi } from "../api/account";
import { noticeApi } from "../api/noticeboard";
import { examApi } from "../api/exam";
import { staffAttandanceApi } from "../api/staffAttendance";
import { studentAttendanceApi } from "../api/studentAttendance";
import { holidaysApi } from "../api/holidays";
import { studentContactApi } from "../api/studentContact";
import { timeTableApi } from "../api/timeTable";

const store = configureStore({
    reducer: {
        auth: authReducer,
        modal: modalReducer,
        enquiry: enquiryReducer,
        student: studentReducer,
        utils: utilsReducer,

        [authApi.reducerPath]: authApi.reducer,
        [standardApi.reducerPath]: standardApi.reducer,
        [subjectApi.reducerPath]: subjectApi.reducer,
        [shiftApi.reducerPath]: shiftApi.reducer,
        [batchApi.reducerPath]: batchApi.reducer,
        [standardAndSubjectApi.reducerPath]: standardAndSubjectApi.reducer,
        [admissionApi.reducerPath]: admissionApi.reducer,
        [enquiryApi.reducerPath]: enquiryApi.reducer,
        [schoolApi.reducerPath]: schoolApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [commonApi.reducerPath]: commonApi.reducer,
        [noticeApi.reducerPath]: noticeApi.reducer,
        [examApi.reducerPath]: examApi.reducer,
        [staffAttandanceApi.reducerPath]: staffAttandanceApi.reducer,
        [studentAttendanceApi.reducerPath]: studentAttendanceApi.reducer,
        [holidaysApi.reducerPath]: holidaysApi.reducer,
        [studentContactApi.reducerPath]: studentContactApi.reducer,
        [timeTableApi.reducerPath]: timeTableApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authApi.middleware)
            .concat(standardApi.middleware)
            .concat(subjectApi.middleware)
            .concat(shiftApi.middleware)
            .concat(batchApi.middleware)
            .concat(standardAndSubjectApi.middleware)
            .concat(admissionApi.middleware)
            .concat(commonApi.middleware)
            .concat(schoolApi.middleware)
            .concat(studentApi.middleware)
            .concat(enquiryApi.middleware)
            .concat(staffApi.middleware)
            .concat(accountApi.middleware)
            .concat(noticeApi.middleware)
            .concat(examApi.middleware)
            .concat(staffAttandanceApi.middleware)
            .concat(studentAttendanceApi.middleware)
            .concat(studentContactApi.middleware)
            .concat(holidaysApi.middleware)
            .concat(timeTableApi.middleware),
});

setupListeners(store.dispatch);

const createActions = (slice) => _.mapValues(slice.actions, (actionCreator) => (payload) => store.dispatch(actionCreator(payload)));

export const actions = {
    auth: createActions(authSlice),
    modal: createActions(modalSlice),
    enquiry: createActions(enquirySlice),
    student: createActions(studentSlice),
    utils: createActions(utilsSlice),
};

export default store;
