import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";
// import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Student";
export const studentApi = createApi({
    reducerPath: "studentApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getStudentRecord: builder.query({
            query: ({ standardId, batchId }) => {
                const opts = {};
                if (standardId && batchId) opts.params = { standardId, batchId };
                else if (standardId) opts.params = { standardId };
                else if (batchId) opts.params = { batchId };

                return {
                    url: `confirm/studentget`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        checkAttendance: builder.query({
            query: ({ standardId, batchId, date }) => {
                const opts = {};
                opts.params = { standardId: standardId || "", batchId: batchId || "", date: date || "" };

                return {
                    url: `/attendance/checkAttendance`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        takeAttendance: builder.mutation({
            query: (body) => ({
                url: "/attendance/studentAttendance",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            transformErrorResponse: (response, meta, arg) => response.status,
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useGetStudentRecordQuery, useTakeAttendanceMutation, useCheckAttendanceQuery } = studentApi;
