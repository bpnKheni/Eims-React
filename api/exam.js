import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Exam";
export const examApi = createApi({
    reducerPath: "examApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/exam`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getExam: builder.query({
            query: () => {
                return {
                    url: "/getExam",
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        createExam: builder.mutation({
            query: (body) => ({
                url: "/examCreate",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        updateExam: builder.mutation({
            query: ({ examId, examData }) => ({
                url: `/updateExam/${examId}`,
                method: "PUT",
                body: examData,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteExam: builder.mutation({
            query: (id) => ({
                url: `/deleteExam/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        getTestNumber: builder.query({
            query: (standardId) => {
                return {
                    url: `/testNumberGet/${standardId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        generateTestNumber: builder.query({
            query: (standardId) => {
                return {
                    url: `/testNumber/${standardId}`,
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        getExamReport: builder.query({
            query: ({ testNumber, standardId }) => {
                const opts = {};
                if (standardId && testNumber) opts.params = { standardId, testNumber };
                return {
                    url: `/resultGet`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        createExamResult: builder.mutation({
            query: (body) => ({
                url: "/result",
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

export const {
    useGetExamQuery,
    useCreateExamMutation,
    useUpdateExamMutation,
    useDeleteExamMutation,
    useGenerateTestNumberQuery,
    useGetTestNumberQuery,
    useGetExamReportQuery,
    useCreateExamResultMutation,
} = examApi;
