import queryString from 'query-string'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  tagTypes: ["Transactions"],
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
    fetchTransactions: builder.query({
      query: (params) => ({
        url: "/api/transactions",
        method: "GET",
        params: params
      }),
      transformResponse: (response) => response.result,
      providesTags: ["Transactions"]
    }),
    viewTransaction: builder.query({
      query: (id) => ({
        url: "/api/transactions/" + id,
        method: "GET",
      }),
      transformResponse: (response) => response.result
    }),
    receiveTransactions: builder.mutation({
      query: (body) => ({
        url: "/api/transactions/flow/receive",
        method: "POST",
        body: body
      }),
      invalidatesTags: (_, error) => error ? [] : ["Transactions"]
    }),
    mutateTransaction: builder.mutation({
      query: ({ id, ...body }) => ({
        url: "/api/transactions/flow/update-transaction/" + id,
        method: "POST",
        body: body
      }),
      invalidatesTags: (_, error) => error ? [] : ["Transactions"]
    }),
  })
})

export const {
  useFetchTransactionsQuery,
  useViewTransactionQuery,

  useReceiveTransactionsMutation,

  useMutateTransactionMutation,
} = transactionApi