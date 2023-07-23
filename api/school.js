import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, prepareHeaders } from "./util";
import { api } from "../utils/constants/url";
import { showSuccessToast } from "../utils/constants/api/toast";

const type = "School";
export const schoolApi = createApi({
  reducerPath: "schoolApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${api.baseURL}/school`,
    prepareHeaders,
  }),
  tagTypes: [type],
  endpoints: (builder) => ({
    getSchool: builder.query({
      query: () => {
        return {
          url: "/schoolGet",
          method: "GET",
        };
      },
      providesTags: [type],
    }),
    createSchool: builder.mutation({
      query: (body) => ({
        url: "/schoolCreate",
        method: "POST",
        body,
      }),
      transformResponse: (response, meta, arg) => {
        response?.status === 201 && showSuccessToast(response?.message);
        return response.data;
      },
      transformErrorResponse: (response, meta, arg) => response.status,
      invalidatesTags: (result, error, arg) => !error && [type],
    }),
  }),
});

export const { useGetSchoolQuery, useCreateSchoolMutation } = schoolApi;
