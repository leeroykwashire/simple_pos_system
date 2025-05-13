import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "../categories/categoriesSlice";
import { useAddProductMutation } from "./productsSlice";
import { productsApiSlice } from "./productsSlice";

export default function AddProductModal() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState(0);
  const [price, setPrice] = useState();
  const [costPrice, setCostPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [message, setMessage] = useState(null);
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  const clearMessage = () => {
    setMessage(null);
  }

  // Destructure useAddProductMutation
  const [addProduct, { isLoading: isAdding, isSuccess, error: addProductError }] = useAddProductMutation(productsApiSlice);

  useEffect(() => {
    if (isSuccess) {
        setMessage("Product added successfully!"); // Set success message
        console.log("Added successfully")
    } else if (addProductError) {
        setMessage(`Error: ${error.message}`); // Set error message
        console.log("Failed to add product")
    } else {
        setMessage(null);
    }
}, [isSuccess, addProductError]); // Re-do effect when isSuccess or addProductError changes

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare product data
    const productData = {
      name,
      description,
      category: parseInt(category),
      price: parseFloat(price),
      cost_price: parseFloat(costPrice),
      stock_quantity: parseInt(quantity),
    };

    try {
      await addProduct(productData);
      console.log("Product added successfully!");

      // Clear the form
      setName("");
      setDescription("");
      setCategory(0);
      setPrice("");
      setQuantity("");
      setCostPrice("");
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  return (
    <>
      <div className="modal" id={"add-product-modal"} data-bs-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Add New Product</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={clearMessage}></button>
            </div>

            <div className="modal-body">

              <form onSubmit={handleSubmit}>
                <input
                  type="text" name="name" required
                  className="form-control" placeholder="name"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className="form-control mt-3" name="description"
                  id="desc" placeholder="description" required
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mt-3">
                  <select
                    name="category"
                    id="sel1" required
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" readOnly selected>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="number" name="cost-price" required
                  className="form-control mt-3" placeholder="stock price"
                  value={costPrice} onChange={(e) => setCostPrice(e.target.value)}
                />

                <input
                  type="number" name="price" required
                  className="form-control mt-3" placeholder="price"
                  value={price} onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="number" name="quantity" required
                  className="form-control mt-3" placeholder="stock quantity"
                  value={quantity} onChange={(e) => setQuantity(e.target.value)}
                />

                <input
                  className="btn btn-success mt-3" type="submit"
                  value={isAdding ? "Adding Product..." : "Add Product"} disabled={isAdding} // Disable submit button while adding
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
