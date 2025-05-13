import { useGetProductsQuery } from "./productsSlice";
import { useGetCategoriesQuery } from "../categories/categoriesSlice";
import { useState } from "react";
import {Link} from "react-router-dom"
import {FaTrash} from 'react-icons/fa' 
import {FaEdit} from 'react-icons/fa'
import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./deleteProductModal";
import CirclesSpinner from "../../assets/spinners/Circles";

export default function Products() {
  const [query, setQuery] = useState('');
  const [productIdToDelete, setProductIdToDelete] = useState(0)
  const { data: products = [], isLoading, error } = useGetProductsQuery();
  const { data: categories = [], isLoading: loading, error:isError} = useGetCategoriesQuery();

  const getCategoryById = (categoryId) => {
      const foundCategory = categories.find(category => category.id === categoryId);
      return foundCategory ? foundCategory.name : null; // Return null if product not found
    };

  if (isLoading || loading) {
    //return <div className="mt-5 w-50 mx-auto py-5"><h3 className="text-center">Loading...</h3></div>;
    return(
      <div className='container mt-5 py-5'>
          <div className='fit-content mx-auto h-50 mt-5'>
              <CirclesSpinner/>
          </div> 
      </div>
    )
  }

  else if (error || isError) {
    return <div className="mt-5 w-50 mx-auto py-5"><p>Error: {error.message}</p></div>;
  }

  else {
    const filteredProducts = products.filter(
      products => products.name.toLowerCase().includes(query.toLowerCase())
    );
    return(
      <>
        <DeleteProductModal productId={productIdToDelete}/>
        <AddProductModal/>
        <div className='container-fluid row light-bg mx-auto p-2 rounded-0 shadow-sm'>
          <div className='col-9'>
            <input type="text" className="form-control w-25" placeholder="search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className='col-3'>
            <button className='btn btn-success' type="button" data-bs-toggle="modal" data-bs-target="#add-product-modal">Add Product</button>
          </div>

        </div>

        <div className="container-fluid mt-5 py-3 light-bg rounded-0 w-100 shadow-sm">
          {filteredProducts.length > 0 ? (
            <table className="w-100 table table-striped shadow-sm">
              <thead className="bg-success">
                <tr>
                  <th className="py-1 pl-2"><p>Name</p></th>
                  <th className="py-1 pl-2"><p>Description</p></th>
                  <th className="py-1 pl-2"><p>Category</p></th>
                  <th className="py-1 pl-2"><p>Price</p></th>
                  <th className="py-1 pl-2"><p>Qty</p></th>
                  <th className="py-1 pl-2"><p>Action</p></th>
                </tr>

              </thead>
              <tbody>

                {filteredProducts.map((product, i) => (

                  <tr key={i} className="border-light">
                    <td className="pl-2 py-0"><p className="my-2">{product.name}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{product.description}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{getCategoryById(product.category)}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">${product.price}</p></td>
                    
                    
                    <td className="pl-2 py-0">
                    <Link to={`/products/edit-quantity/${product.id}`}>
                      <p className="my-2 dark-text">{product.stock_quantity}</p>
                    </Link>
                    </td>
                    
                    <td className="pl-2 py-0 py-0">
                      <div className='fit-content'>
                        <Link to={`/products/edit/${product.id}`}> <FaEdit className="dark-text" /></Link>
                        <button className='btn mx-1'  data-bs-toggle="modal"
                          data-bs-target="#delete-product-modal" onClick={() => setProductIdToDelete(product.id)}>
                            <FaTrash className='text-danger' />
                        </button>
                      </div>
                    </td>
                  </tr>


                ))}
              </tbody>

            </table>
          ) : (
            <p className="text-center mt-3">No products found.</p>
          )}
        </div>

      </>
    )
  }
}



