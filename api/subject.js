import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/subject`,
    prepareHeaders,
  }),
  tagTypes: ["Subject"],
  endpoints: (builder) => ({
    getSubject: builder.query({
      query: () => {
        return {
          url: "/allSubjectGet",
          method: "GET",
        };
      },
      providesTags: ["Subject"],
    }),
    createSubject: builder.mutation({
      query: (body) => ({
        url: "/subjectCreate",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => !error && ["Subject"],
    }),
    updateSubject: builder.mutation({
      query: (body) => ({
        url: `/subjectUpdate/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => !error && ["Subject"],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjectDelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => !error && ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
