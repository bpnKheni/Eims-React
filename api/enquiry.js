import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "Enquiry";
export const enquiryApi = createApi({
    reducerPath: "enquiryApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/enquiryCreate`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        createEnquiry: builder.mutation({
            query: (body) => ({
                url: "/EnquiryCreate",
                method: "POST",
                body, // Body as Form-Data
            }),
            transformResponse: (response, meta, arg) => {
                if (response?.status === 201) {
                    showSuccessToast(response?.message);
                }
                return response;
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useCreateEnquiryMutation } = enquiryApi;
