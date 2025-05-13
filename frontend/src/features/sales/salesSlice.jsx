import { apiSlice } from "../api/ApiSlice";

export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getSales: builder.query({
      query: () => '/sales/',
      providesTags: ['Sale'],
    }),

    getCurrentDaySales: builder.query({
      query: () => '/sales-today/',
      providesTags: ['Sale'],
    }),    
    
    getMonthlySales: builder.query({
      query: (year) => `/monthly-sales/${year}/`,
      providesTags: (result) => [{ type: 'Sale', id: 'monthly' }],
    }),

    getDailySales: builder.query({
      query: () => `/daily-sales/`,
      providesTags: (result) => ['Sale'],
    }),

    getTopProductMonthly: builder.query({
      query: () => `highest-selling-products-monthly/`,
      providesTags: (result) => ['Sale'],
    }),

    getTopProductsYearly: builder.query({
      query: (year) => `/top-ten-products-yearly/${year}/`,
      providesTags: (result, error, arg) => [{ type: 'Sale', id: arg }],
    }),
    
    getSaleById: builder.query({
      query: (saleId) => `/sales/${saleId}/`,
      providesTags: (result, error, saleId) => [{ type: 'Sale', id: saleId }],
    }),

    addSale: builder.mutation({
      query: (newSale) => ({
        url: '/sales/',
        method: 'POST',
        body: newSale,
      }),
      invalidatesTags: ['Sale'],
    }),

    updateSale: builder.mutation({
      query: ({ saleId, updatedSale }) => ({
        url: `/sales/${saleId}/`,
        method: 'PUT',
        body: updatedSale,
      }),
      invalidatesTags: (result, error, { saleId }) => [{ type: 'Sale', id: saleId }],
    }),

    deleteSale: builder.mutation({
      query: (saleId) => ({
        url: `/sales/${saleId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, saleId) => [{ type: 'Sale', id: saleId }],
    }),
  }),
});

// Export individual endpoints for use in components
export const {
  useGetSalesQuery,
  useGetCurrentDaySalesQuery,
  useGetMonthlySalesQuery,
  useGetDailySalesQuery,
  useGetTopProductMonthlyQuery,
  useGetTopProductsYearlyQuery,
  useGetSaleByIdQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = saleApiSlice;
