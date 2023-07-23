import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

const type = "Batch";

export const batchApi = createApi({
    reducerPath: "batchApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/batch`,
        prepareHeaders,
    }),
    tagTypes: [type],
    endpoints: (builder) => ({
        getBatch: builder.query({
            query: (standardId) => {
                const opts = {};
                if (standardId) opts.params = { standardId };
                return {
                    url: `/allbatchGet`,
                    method: "GET",
                    ...opts,
                };
            },
            providesTags: [type],
        }),
        createBatch: builder.mutation({
            query: (body) => ({
                url: "/batchCreate",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        updateBatch: builder.mutation({
            query: (body) => ({
                url: `/batchUpdate/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
        deleteBatch: builder.mutation({
            query: (id) => ({
                url: `/batchDelete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && [type],
        }),
    }),
});

export const { useGetBatchQuery, useCreateBatchMutation, useUpdateBatchMutation, useDeleteBatchMutation } = batchApi;
