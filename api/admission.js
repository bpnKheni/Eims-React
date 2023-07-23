import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Admission";
export const admissionApi = createApi({
    reducerPath: "admissionApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/admissionCreate`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getAdmissionEnquiryListing: builder.query({
            query: (studentId) => {
                const opts = {};
                if (studentId) opts.params = { id: studentId };
                return {
                    url: `/enquiryListing`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        getFeesDetails: builder.query({
            query: (studentId) => ({
                url: `/getFeesDetail/${studentId}`,
                method: "GET",
            }),
            providesTags: [type],
        }),
        confirmAdmission: builder.mutation({
            query: (body) => ({
                url: "/admissionConfirm",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        createRollNumber: builder.mutation({
            query: (body) => ({
                url: "/rollNumber",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        updateAdmission: builder.mutation({
            query: (payload) => {
                const { formData, studentId } = payload;
                return {
                    url: `/admissionUpdate/${studentId}`,
                    method: "PUT",
                    body: formData,
                };
            },
            transformResponse: (response, meta, arg) => {
                [200, 201, 202, "success", "Success"].includes(response?.status) && showSuccessToast(response?.message);
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteAdmission: builder.mutation({
            query: (id) => ({
                url: `/admissiondelete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const {
    useGetAdmissionEnquiryListingQuery,
    useGetFeesDetailsQuery,
    useConfirmAdmissionMutation,
    useCreateRollNumberMutation,
    useUpdateAdmissionMutation,
    useDeleteAdmissionMutation,
} = admissionApi;
