import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Notice";
export const noticeApi = createApi({
    reducerPath: "noticeApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/notice`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getNotice: builder.query({
            query: () => {
                return {
                    url: "/getNotice",
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        createNotice: builder.mutation({
            query: (body) => ({
                url: "/noticeCreate",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response.data;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        updateNotice: builder.mutation({
            query: (body) => ({
                url: `/updateNotice/${body.id}`,
                method: "PUT",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response.data;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteNotice: builder.mutation({
            query: (id) => ({
                url: `/deleteNotice/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response.data;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useCreateNoticeMutation, useGetNoticeQuery, useUpdateNoticeMutation, useDeleteNoticeMutation } = noticeApi;
