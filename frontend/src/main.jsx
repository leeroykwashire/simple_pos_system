import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'boxicons'
import './index.css'
import SideNav from './components/SideNav.jsx'
import NotFound from './components/404Err.jsx'
import HomePage from './components/HomePage.jsx'
import PointOfSale from './components/POS.jsx'
import Products from './features/products/Products.jsx'
import Categories from './features/categories/Categories.jsx'
import Sales from './features/sales/Sales.jsx'
import EditProduct from './features/products/editProduct.jsx'
import EditProductQuantity from './features/products/EditProductQuantity.jsx'
import EditCategory from './features/categories/editCategory.jsx'
import Reports from './components/Reports.jsx'
import Users from './features/users/Users.jsx'
import CompanyDetails from './features/company/Company.jsx'
import EditUser from './features/users/EditUser.jsx'
import EditCompanyDetails from './features/company/EditCompanyDetails.jsx'
import Login from './auth/Login.jsx'
import LoggedIn from './auth/LoggedIn.jsx'

const router = createBrowserRouter([
  {
    path: '/' ,
    element: <SideNav/>,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/categories',
        element: (
            <Categories />
        ),
      },
      {
        path: '/products',
        element: <Products />
      },  
      {
        path: '/pos',
        element: <PointOfSale />
      },
      {
        path: '/sales',
        element: <Sales />
      }, 
      {
        path: '/reports',
        element: <Reports />
      },
      {
        path: '/products/edit/:product_id',
        element: <EditProduct />
      }, 
      {
        path: '/products/edit-quantity/:product_id',
        element: <EditProductQuantity />
      }, 
      {
        path: '/categories/edit/:category_id',
        element: <EditCategory />
      }, 
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/users/edit/:userId',
        element: <EditUser />
      },
      {
        path: '/company',
        element: <CompanyDetails />
      },
      {
        path: '/company/edit/:companyId',
        element: <EditCompanyDetails/>
      },

    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
