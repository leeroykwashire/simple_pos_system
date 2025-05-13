import { useGetCategoriesQuery } from "./categoriesSlice";
import { useState } from "react";
import {Link} from "react-router-dom"
import {FaTrash} from 'react-icons/fa' 
import {FaEdit} from 'react-icons/fa'
import AddCategoryModal from "./addCategoryModal";
import DeleteCategoryModal from "./deleteCategoryModal";
import CirclesSpinner from "../../assets/spinners/Circles";


export default function Categories() {
  const [query, setQuery] = useState('');
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(0)
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  if (isLoading) {
    return(
      <div className='container mt-5 py-5'>
          <div className='fit-content mx-auto h-50 mt-5'>
              <CirclesSpinner/>
          </div> 
      </div>
    )
  }

  else if (error) {
    return <div className="mt-5 w-50 mx-auto py-5"><p>Error: {error.message}</p></div>;
  }

  else {
    const filteredCategories = categories.filter(
      categories => categories.name.toLowerCase().includes(query.toLowerCase())
    );
    return(
      <>
        <DeleteCategoryModal categoryId={categoryIdToDelete}/>
        
        <AddCategoryModal/>
        <div className='container-fluid row light-bg mx-auto p-2 rounded-0 shadow-sm'>
          <div className='col-9'>
            <input type="text" className="form-control w-25" placeholder="search categories" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className='col-3'>
            <button className='btn btn-success' type="button" data-bs-toggle="modal" data-bs-target="#add-category-modal">Add Category</button>
          </div>

        </div>

        <div className="container-fluid mt-5  py-5 light-bg shadow-sm rounded-0 w-100">
          {filteredCategories.length > 0 ? (
            <table className="w-90 mx-auto table table-striped shadow-sm">
              <thead className="bg-success">
                <tr>
                  <th className="py-1 pl-2"><p>Name</p></th>
                  <th className="py-1 pl-2"><p>Action</p></th>
                </tr>

              </thead>
              <tbody>

                {filteredCategories.map((category) => (

                  <tr key={category.id} className="border-light">
                    <td className="pl-2 py-1"><p className="my-1">{category.name}</p></td>

                    <td className="pl-2 py-0">
                      <div className='fit-content'>
                        <Link to={`/categories/edit/${category.id}`}> <FaEdit className='dark-text' /></Link>
                        <button className='btn mx-1'  data-bs-toggle="modal"
                          data-bs-target="#delete-category-modal" onClick={() => setCategoryIdToDelete(category.id)}>
                            <FaTrash className='text-danger' />
                        </button>
                      </div>

                    </td>
                  </tr>


                ))}
              </tbody>

            </table>
          ) : (
            <p className="text-center mt-3">No categories found.</p>
          )}
        </div>

      </>
    )
  }
}



