import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

export const staffApi = createApi({
    reducerPath: "staffApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/staff`,
        prepareHeaders,
    }),
    tagTypes: ["Staff"],
    endpoints: (builder) => ({
        getStaff: builder.query({
            query: () => {
                return {
                    url: "/staffGet",
                    method: "GET",
                };
            },
            providesTags: ["Staff"],
        }),
        createStaff: builder.mutation({
            query: (body) => ({
                url: "/staffCreate",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && ["Staff"],
        }),
        updateStaff: builder.mutation({
            query: ({ staffId, ...data }) => {
                return {
                    url: `/staffUpdate/${staffId}`,
                    method: "PUT",
                    body: data,
                };
            },
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.statusbar) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && ["Staff"],
        }),
        updateStaffPassword: builder.mutation({
            query: (body) => ({
                url: `/staffPasswordUpdate/${body.staffId}`,
                method: "PUT",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && ["Staff"],
        }),
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `/staffDelete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && ["Staff"],
        }),
    }),
});

export const { useCreateStaffMutation, useDeleteStaffMutation, useGetStaffQuery, useUpdateStaffMutation, useUpdateStaffPasswordMutation } = staffApi;
