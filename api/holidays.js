import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Holiday";
export const holidaysApi = createApi({
    reducerPath: "holidayApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/holiday`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getHolidays: builder.query({
            query: () => {
                return {
                    url: "/holidayGet",
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        createHoliday: builder.mutation({
            query: (body) => ({
                url: "/holidayCreate",
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

export const { useGetHolidaysQuery, useCreateHolidayMutation } = holidaysApi;
