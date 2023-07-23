import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "ContactList";
export const contactListApi = createApi({
    reducerPath: "holidayApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/holiday`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getContactList: builder.query({
            query: () => {
                return {
                    url: "/contact/list",
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
    }),
});

export const { useGetContactListQuery } = contactListApi;
