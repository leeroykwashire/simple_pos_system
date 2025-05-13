import { useGetProductQuery, useEditProductMutation } from "./productsSlice";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CirclesSpinner from "../../assets/spinners/Circles";

export default function EditProduct() {
  const navigate = useNavigate();
  const params = useParams();
  const product_id = params.product_id;

  const [name, setName] = useState(""); // Initial state
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);


  const { data: product, isLoading, error } = useGetProductQuery(product_id);
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCostPrice(product.cost_price);
    }
  }, [product]); // Dependency array to make sure useEffect runs only when product changes
  const [updateProduct, { isSuccess, isError, loading=isLoading }] = useEditProductMutation();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    await updateProduct({
      id: product_id,
      name,
      description,
      price,
      costPrice,
    });

    if (isSuccess) {
      navigate('/products'); // Navigate to product list
    } else if (isError) {
      console.error('Error updating product:', error);
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
    return <div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find requested product</p></div>;
  } else {      
    return (
      <>
        <h1 className="text-center mt-2">Edit Product</h1>
        <div className="container mt-4 w-75 mx-auto light-bg p-3 rounded-3">
          <form onSubmit={handleSubmit}>
                <label htmlFor="name" className="mb-1 mt-2">Name</label>
                <input type="text" name="name" placeholder="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/>

                <label htmlFor="description" className="mb-1 mt-3">Description</label>
                <textarea type="text" name="description" placeholder="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}/>

                <label htmlFor="price" className="mb-1 mt-3">Price</label>
                <input type="text" name="price" placeholder="e.g 10.50" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)}/>

                <label htmlFor="cost-price" className="mb-1 mt-3">Cost Price</label>
                <input type="text" name="cost_price" placeholder="e.g 10.50" className="form-control" value={costPrice} onChange={(e) => setCostPrice(e.target.value)}/>
                <div className="fit-content mx-auto">
                  <button className="btn btn-primary mt-4 mb-2 mx-2" type="submit">Edit Product</button>
                  <Link to={"/products"} className="btn btn-danger mt-4 mb-2" type="submit">Return to list</Link >
                </div>

          </form>
        </div>
      </>
    );
  }
}
