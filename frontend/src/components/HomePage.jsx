import { Link } from 'react-router-dom';
import { useGetCurrentDaySalesQuery, useGetSalesQuery } from '../features/sales/salesSlice';
import { useGetProductsQuery } from '../features/products/productsSlice';
import { useGetCategoriesQuery } from '../features/categories/categoriesSlice';
import CirclesSpinner from '../assets/spinners/Circles';


export default function HomePage(){

    const { data: products = [], loading: productsLoading, error: productsError } = useGetProductsQuery();
    const { data: categories = [], isLoading: categoriesloading, error:categoriesError} = useGetCategoriesQuery();
    const { data: sales = [], isLoading: salesLoading, error:salesError} = useGetCurrentDaySalesQuery();
    if (productsLoading || categoriesloading || salesLoading) {
      //return <div className="mt-5 w-50 mx-auto py-5"><h3 className="text-center">Loading...</h3></div>;
      return(
        <div className='container mt-5 py-5'>
            <div className='fit-content mx-auto h-50 mt-5'>
                <CirclesSpinner/>
            </div> 
        </div>
      )   
    }
    else if (productsError || categoriesError || salesError) {
      return <div className="mt-5 w-50 mx-auto py-5">
        <p>Error: {productsError? 
            products.message: categoriesError? 
            categoriesError.message:
            salesError.message}</p></div>;
    }
  
    else {          
        return(
            <>
                <div className="row mx-auto mt-5">
                    <Link to={'/categories'} className='col-4 decorate-none text-dark h-25'>
                        <div className="px-2 border bg-success rounded-3 shadow">
                            <h5>Categories</h5>
                            <h1>{categories.length? categories.length: 0}</h1>
                        </div>
                    </Link>
                    <Link to={'/products'} className='col-4 decorate-none text-dark h-25'>
                        <div className="px-2 border bg-info rounded-3 shadow">
                            <h5>Products</h5>
                            <h1>{products.length? products.length: 0}</h1>
                        </div>
                    </Link>
                    <Link to={'/sales'} className='col-4 decorate-none text-dark h-25'>
                        <div className="px-2 border bg-warning rounded-3 shadow">
                            <h5>Today's Sales</h5>
                            <h1>{sales.length ? sales.length: 0}</h1>
                        </div>
                    </Link>         
                </div>
                <div className='container mx-auto mt-5 p-5 w-50'>
                <Link to={'/pos'} className='col-4 decorate-none text-dark h-25'>
                        <div className="px-2 pt-2 border rounded-3 shadow-hover light-bg">
                            <h5 className='text-center'>New Sale</h5>
                        </div>
                    </Link>
    
                </div>
            </>
        )
    }
}