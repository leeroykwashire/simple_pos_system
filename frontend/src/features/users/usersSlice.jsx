import { apiSlice } from "../api/ApiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query({
      query: () => '/users/',
      providesTags: (result = [], error, arg) => [
        'User',
        ...result.map(({ id }) => ({ type: 'User', id }))
      ]
    }),

    getCurrentUser: builder.query({
      query: () => '/current-user/',
      providesTags: (result) => result ? [{ type: 'User', id: result.id }] : [],
    }),

    getUserById: builder.query({
      query: (userId) => `/users/${parseInt(userId)}/`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    
    getUserByName: builder.query({
      query: (username) => `/users/get-by-name/${username}/`,
      providesTags: (result, error, username) => [{ type: 'User', username: username }],
    }),
  
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: '/users/',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),

    editUser: builder.mutation({
      query: user => ({
          url: `/users/${user.id}/`,
          method: 'PUT',
          body: user
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
  }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/`,
        method: 'DELETE',
      }),      
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg }],
    }),
  }),
});

// Export individual endpoints for use in components
export const {
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetUserByNameQuery,
} = usersApiSlice;
