import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./util";
import { api } from "../utils/constants/url";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: api.baseURL,
  }),
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => {
        return {
          url: "/Login",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["CurrentUser"],
    }),
  }),
});

export const { useLoginMutation } = authApi;
