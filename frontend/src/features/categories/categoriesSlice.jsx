import { apiSlice } from "../api/ApiSlice"

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    getCategories: builder.query({
      query: () => '/categories/',
      providesTags: (result = [], error, arg) => [
        'Category',
        ...result.map(({ id }) => ({ type: 'Category', id }))
      ]
    }),

    getCategory: builder.query({
        query: categoryId => `/categories/${categoryId}/`,
        providesTags: (result, error, arg) => [{ type: 'Category', id: arg }]
      }),

    addCategory: builder.mutation({
        query: category => ({
          url: '/categories/',
          method: 'POST',
          body: category
        }),
        invalidatesTags: ['Category']
      }),
    
    editCategory: builder.mutation({
        query: category => ({
            url: `/categories/${category.id}/`,
            method: 'PUT',
            body: category
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }]
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Category", id: arg }],
    }),
  })
})

export const {
  useGetCategoriesQuery, useGetCategoryQuery,
  useAddCategoryMutation, useEditCategoryMutation,
  useDeleteCategoryMutation
} = categoriesApiSlice
