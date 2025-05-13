import { useState, useEffect } from "react";
import { useAddCategoryMutation } from "./categoriesSlice";
import { categoriesApiSlice } from "./categoriesSlice";

export default function AddCategoryModal() {
  const [name, setName] = useState();
  const [message, setMessage] = useState(null);

  const clearMessage = () => {
    setMessage(null);
  }
  // Destructure useAddCategoryMutation
  const [addCategory, { isLoading: isAdding, isSuccess, error: addCategoryError }] = useAddCategoryMutation(categoriesApiSlice);

  useEffect(() => {
    if (isSuccess) {
        setMessage("Category added successfully!"); // Set success message
        console.log("Added successfully")
    } else if (addCategoryError) {
        setMessage(`Error: ${error.message}`); // Set error message
        console.log("Failed to add category")
    } else {
        setMessage(null);
    }
}, [isSuccess, addCategoryError]); // Re-do effect when isSuccess or addCategoryError changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    const categoryData = {
      name,
    };
    try {
      await addCategory(categoryData);
      console.log("Category added successfully!");
      // Clear the form
      setName("");
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <>
      <div className="modal mt-5" id={"add-category-modal"} data-bs-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Add New Category</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={clearMessage}></button>
            </div>

            <div className="modal-body">

              <form onSubmit={handleSubmit}>
                <input
                  type="text" name="name" required
                  className="form-control" placeholder="name"
                  value={name} onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="btn btn-success mt-3" type="submit"
                  value={isAdding ? "Adding Category..." : "Add Category"} disabled={isAdding} // Disable submit button while adding
                />
              </form>

              {message && (
                  <div className={isSuccess ? "alert alert-success mt-2" : "alert alert-danger mt-2"}>
                      {message}
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
