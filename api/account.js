import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

const type = "Account";
export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/account`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getAllFeesCollection: builder.query({
            query: (studentId) => {
                const opts = {};
                if (studentId) opts.params = { id: studentId };
                return {
                    url: `/allAccount`,
                    method: "GET",
                    ...opts,
                };
            },
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteIncome: builder.mutation({
            query: (id) => ({
                url: `/income/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `/expense/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useGetAllFeesCollectionQuery, useDeleteExpenseMutation, useDeleteIncomeMutation } = accountApi;
