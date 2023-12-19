import queryString from 'query-string'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const companiesApi = createApi({
  reducerPath: "companiesApi",
  tagTypes: ["Companies"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json")
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)

      return headers
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
        skipEmptyString: true,
      })
    }
  }),
  endpoints: (builder) => ({
    fetchCompanies: builder.query({
      query: (params) => ({
        url: "/api/admin/companies",
        method: "GET",
        params: params
      }),
      transformResponse: (response) => response.result,
      providesTags: ["Companies"]
    })
  })
})

export const {
  useFetchCompaniesQuery
} = companiesApi