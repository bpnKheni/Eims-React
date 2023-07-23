import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

const type = "StudentContact";
export const studentContactApi = createApi({
    reducerPath: "studentContact",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/contact`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getContacts: builder.query({
            query: () => {
                return {
                    url: "/list",
                    method: "GET",
                };
            },
            providesTags: [type],
        }),
        deleteStudentContact: builder.mutation({
            query: (id) => ({
                url: `/studentDelete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && ["Student"],
        }),
    }),
});

export const { useGetContactsQuery, useDeleteStudentContactMutation } = studentContactApi;
