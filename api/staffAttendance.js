import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "StaffAttandanceApi";
export const staffAttandanceApi = createApi({
    reducerPath: "staffAttandanceApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/staffAttendance`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getStaffAttendance: builder.query({
            query: ({ startDate, endDate }) => {
                const opts = {};
                if (!startDate || !endDate) throw new Error("Please Provide Valid Date Range");
                if (startDate && endDate) opts.params = { startDate, endDate };

                return {
                    url: `staffAttendanceGet`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        createStaffAttendance: builder.mutation({
            query: (body) => ({
                url: "/staffAttendance",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useCreateStaffAttendanceMutation, useGetStaffAttendanceQuery } = staffAttandanceApi;
