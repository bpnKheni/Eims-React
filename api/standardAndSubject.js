import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "StandardAndSubject";
export const standardAndSubjectApi = createApi({
    reducerPath: "standardAndSubjectApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/standardAndSubject`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getStandardAndSubject: builder.query({
            query: () => {
                return {
                    url: "/getStandardAndSubject",
                    method: "GET",
                };
            },

            providesTags: [type],
        }),
        getStdAndSubByStandard: builder.query({
            query: (id) => {
                return {
                    url: `/${id}`,
                    method: "GET",
                };
            },
            transformResponse: (response, meta, arg) => {
                if (response?.status === 200) return response.data?.subjects;
            },
            providesTags: [type],
        }),
        createStandardAndSubject: builder.mutation({
            query: (body) => ({
                url: "/standardAndSubjectFeesCreate",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                response?.status === 201 && showSuccessToast(response?.message);
                return response.data;
            },
            transformErrorResponse: (response, meta, arg) => response.status,
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useGetStandardAndSubjectQuery, useGetStdAndSubByStandardQuery, useCreateStandardAndSubjectMutation } = standardAndSubjectApi;
