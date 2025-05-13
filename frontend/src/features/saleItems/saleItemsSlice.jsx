import { apiSlice } from "../api/ApiSlice";

export const saleItemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getSaleItems: builder.query({
      query: (saleId) => `/sale-items/?saleId=${saleId}`,
      providesTags: (result, error, saleId) => [{ type: 'SaleItem', id: saleId }],
    }),
    addSaleItem: builder.mutation({
      query: (data) => ({
        url: '/sale-items/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'SaleItem', id: result.data.id }],
    }),
      
    getSaleItemsBySaleId: builder.query({
      query: (saleId) => `/sale-items/${saleId}/`,
      providesTags: (result, error, arg) => [{ type: 'SaleItem', id: arg }],
    }),

    updateSaleItem: builder.mutation({
      query: ({ saleItemId, updatedSaleItem }) => ({
        url: `/sale-item/${saleItemId}/`,
        method: 'PUT',
        body: updatedSaleItem,
      }),
      invalidatesTags: (result, error, { saleId }) => [{ type: 'SaleItem', id: saleId }],
    }),

    deleteSaleItem: builder.mutation({
      query: (saleItemId) => ({
        url: `/sale-item/${saleItemId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { saleId }) => [{ type: 'SaleItem', id: saleId }],
    }),
  }),
});

export const {
  useGetSaleItemsQuery,
  useGetSaleItemsBySaleIdQuery,
  useAddSaleItemMutation,
  useUpdateSaleItemMutation,
  useDeleteSaleItemMutation,
} = saleItemsApiSlice;
