import queryString from 'query-string'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// import {
//   RECEIVE,

//   HOLD,
//   UNHOLD,

//   RETURN,
//   UNRETURN,

//   VOID
// } from '../../constants'

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
    getTransactions: builder.query({
      query: (params) => ({
        url: "/api/transactions",
        method: "GET",
        params: params
      }),
      transformResponse: (response) => response.result,
      providesTags: ["Transactions"]
    }),
    mutateTransaction: builder.mutation({
      query: ({ id, ...body }) => ({
        url: "/api/transactions/flow/update-transaction/" + id,
        method: "POST",
        body: body
      }),
      invalidatesTags: ["Transactions"]
    }),

    // receiveTransaction: builder.mutation({
    //   query: ({ id, process }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       process: process,
    //       subprocess: RECEIVE
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // }),
    // unholdTransaction: builder.mutation({
    //   query: ({ id, process }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       process: process,
    //       subprocess: UNHOLD
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // }),
    // unreturnTransaction: builder.mutation({
    //   query: ({ id, process }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       process: process,
    //       subprocess: UNRETURN
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // }),

    // holdTransaction: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       ...body,
    //       subprocess: HOLD
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // }),
    // returnTransaction: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       ...body,
    //       subprocess: RETURN
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // }),
    // voidTransaction: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: "/api/transactions/flow/update-transaction/" + id,
    //     method: "POST",
    //     body: {
    //       ...body,
    //       subprocess: VOID
    //     }
    //   }),
    //   invalidatesTags: ["Transactions"]
    // })
  })
})

export const {
  useGetTransactionsQuery,

  useMutateTransactionMutation,

  // useReceiveTransactionMutation,

  // useHoldTransactionMutation,
  // useUnholdTransactionMutation,

  // useReturnTransactionMutation,
  // useUnreturnTransactionMutation,

  // useVoidTransactionMutation
} = transactionApi