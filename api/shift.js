import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

export const shiftApi = createApi({
    reducerPath: "shiftApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: `${api.baseURL}/shift`,
        prepareHeaders,
    }),
    tagTypes: ["Shift"],
    endpoints: (builder) => ({
        getShift: builder.query({
            query: () => {
                return {
                    url: "/allshiftGet",
                    method: "GET",
                };
            },
            providesTags: ["Shift"],
        }),
        createShift: builder.mutation({
            query: (body) => ({
                url: "/shiftCreate",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => !error && ["Shift"],
        }),
        updateShift: builder.mutation({
            query: (body) => ({
                url: `/shiftUpdate/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => !error && ["Shift"],
        }),
        deleteShift: builder.mutation({
            query: (id) => ({
                url: `/shiftDelete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => !error && ["Shift"],
        }),
    }),
});

export const { useCreateShiftMutation, useDeleteShiftMutation, useGetShiftQuery, useUpdateShiftMutation } = shiftApi;
