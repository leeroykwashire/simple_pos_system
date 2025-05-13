import { apiSlice } from "../api/ApiSlice"

export const companiesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    getCompanies: builder.query({
      query: () => '/companies/',
      providesTags: (result = [], error, arg) => [
        'Company',
        ...result.map(({ id }) => ({ type: 'Company', id }))
      ]
    }),

    getCompany: builder.query({
        query: companyId => `/companies/${companyId}/`,
        providesTags: (result, error, arg) => [{ type: 'Company', id: arg }]
      }),

    addCompany: builder.mutation({
        query: company => ({
          url: '/companies/',
          method: 'POST',
          body: company
        }),
        invalidatesTags: ['Company']
      }),
    
    editCompany: builder.mutation({
        query: company => ({
            url: `/companies/${company.id}/`,
            method: 'PUT',
            body: company
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Company', id: arg.id }]
    }),

    changeCompanyLogo: builder.mutation({
      query: (data) => ({
        url: `/companies/${data.companyId}/change_logo/`, 
        method: 'POST',
        body: data.logoData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Company', id: arg.companyId }]
    }),

    deleteCompany: builder.mutation({
      query: (companyId) => ({
        url: `/companies/${companyId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Company", id: arg }],
    }),
  })
})

export const {
    useGetCompaniesQuery,
    useGetCompanyQuery,
    useEditCompanyMutation,
    useChangeCompanyLogoMutation,
} = companiesApiSlice
