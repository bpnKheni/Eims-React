import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

export const standardApi = createApi({
  reducerPath: "standardApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/standard`,
    prepareHeaders,
  }),
  tagTypes: ["Standard"],
  endpoints: (builder) => ({
    getStandard: builder.query({
      query: () => {
        return {
          url: "/allStandardGet",
          method: "GET",
        };
      },
      providesTags: ["Standard"],
    }),
    createStandard: builder.mutation({
      query: (body) => ({
        url: "/standardCreate",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => !error && ["Standard"],
    }),
    updateStandard: builder.mutation({
      query: (body) => ({
        url: `/standardUpdate/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => !error && ["Standard"],
    }),
    deleteStandard: builder.mutation({
      query: (id) => ({
        url: `/standardDelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => !error && ["Standard"],
    }),
  }),
});

export const {
  useCreateStandardMutation,
  useGetStandardQuery,
  useUpdateStandardMutation,
  useDeleteStandardMutation,
} = standardApi;
