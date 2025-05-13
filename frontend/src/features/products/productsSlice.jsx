import { apiSlice } from "../api/ApiSlice"

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    getProducts: builder.query({
      query: () => '/products/',
      providesTags: (result = [], error, arg) => [
        'Product',
        ...result.map(({ id }) => ({ type: 'Product', id }))
      ]
    }),

    getProduct: builder.query({
        query: productId => `/products/${productId}/`,
        providesTags: (result, error, arg) => [{ type: 'Product', id: arg }]
      }),

    addProduct: builder.mutation({
        query: product => ({
          url: '/products/',
          method: 'POST',
          body: product
        }),
        invalidatesTags: ['Product']
      }),
    
    editProduct: builder.mutation({
        query: product => ({
            url: `/products/${product.id}/`,
            method: 'PUT',
            body: product
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }]
    }),
    editProductQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/products/${id}/`,
        method: 'PATCH',
        body: { quantity }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }]
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
  }),
})


export const {
  useGetProductsQuery, useGetProductQuery,
  useAddProductMutation, useEditProductMutation,
  useDeleteProductMutation, useEditProductQuantityMutation
} = productsApiSlice
export const selectProductsResult = productsApiSlice.endpoints.getProducts.select()