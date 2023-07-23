import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "StudentAttendance";
export const studentAttendanceApi = createApi({
    reducerPath: "studentAttendanceApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/confirm`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        GetStudentAttendance: builder.query({
            query: (studentId) => {
                return {
                    url: `/yearList/${studentId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getResultReport: builder.query({
            query: ({ subjectId, studentId }) => {
                const opts = {};
                if (subjectId && studentId) opts.params = { subjectId, studentId };
                if (studentId) opts.params = { studentId };
                if (subjectId) opts.params = { subjectId, studentId };
                console.log("opts<<<<<>>>>>", opts);
                return {
                    url: `/progress`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetStudentAttendanceQuery, useGetResultReportQuery } = studentAttendanceApi;
