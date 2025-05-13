import { useGetCategoryQuery, useEditCategoryMutation } from "./categoriesSlice";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CirclesSpinner from "../../assets/spinners/Circles";

export default function EditCategory() {
  const navigate = useNavigate();
  const params = useParams();
  const category_id = params.category_id;

  const [name, setName] = useState(""); // Initial state

  const { data: category, isLoading, error } = useGetCategoryQuery(category_id);
  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]); // Dependency array to make sure useEffect runs only when category changes
  const [updateCategory, { isSuccess, isError, loading=isLoading }] = useEditCategoryMutation();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    await updateCategory({
      id: category_id,
      name,
    });

    if (isSuccess) {
      navigate('/categories'); // Navigate to category list
    } else if (isError) {
      console.error('Error updating category:', error);
    }
  };

  if (isLoading) {
    return(
      <div className='container mt-5 py-5'>
          <div className='fit-content mx-auto h-50 mt-5'>
              <CirclesSpinner/>
          </div> 
      </div>
    )
  } else if (error) {
    return <div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find requested category</p></div>;
  } else {      
    return (
      <>
        <h1 className="text-center mt-2 mb-5">Edit Category</h1>
        <div className="container mt-5 w-75 mx-auto light-bg p-3 rounded-3">
            <form>
                <label htmlFor="name" className="mb-1 mt-4 mx-1">Name</label>
                <input type="text" name="name" placeholder="name"
                    className="form-control" value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <div className='fit-content mx-auto mt-4 mb-2'>
                  <button className="btn btn-primary" onClick={handleSubmit}>Edit Category
                  
                  </button>
                  <Link to={'/categories'} className='btn btn-danger mx-1'>
                      Return To List
                  </Link>
                </div>
          </form>
        </div>
      </>
    );
  }
}
