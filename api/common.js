import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";
import { actions } from "../redux/store";

export const commonApi = createApi({
    reducerPath: "commonApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}`,
        prepareHeaders,
    }),
    tagTypes: ["EnquiryCreate", "EnquiryGenerator"],
    endpoints: (builder) => ({
        generateEnquiryNumber: builder.query({
            query: () => {
                return {
                    url: "enquiryCreate/EnquiryNumber",
                    method: "GET",
                };
            },
            transformResponse: (response, meta, arg) => {
                if (response?.status === 200) return response.data;
            },
            providesTags: ["Shift"],
        }),
        registerMobile: builder.mutation({
            query: (body) => ({
                url: "/enquiryCreate/MobileAuth",
                method: "POST",
                body,
            }),
            transformResponse: (response, meta, arg) => {
                if ([201, 200, 202, "success", "Success"].includes(response?.status)) {
                    showSuccessToast(response?.message);
                    actions.modal.closeMobile();
                }
                return response?.data;
            },
            transformErrorResponse: (response, meta, arg) => response.status,
            invalidatesTags: (result, error, arg) => !error && ["EnquiryCreate"],
        }),
    }),
});

export const { useGenerateEnquiryNumberQuery, useRegisterMobileMutation } = commonApi;
