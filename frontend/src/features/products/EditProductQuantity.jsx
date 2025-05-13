import { useState } from 'react';
import { useEditProductQuantityMutation } from './productsSlice';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditProductQuantity = () => {
  const [quantity, setQuantity] = useState(0);
  const [editProductQuantity, isLoading, isError] = useEditProductQuantityMutation();
  const navigate = useNavigate()
  const params = useParams();
  const productId = params.product_id;



  const handleEditQuantity = async () => {
    try {
      await editProductQuantity({ id: productId, quantity }).unwrap();
      console.log('Quantity updated successfully');
      navigate('/products')
    } catch (error) {
      console.error('Failed to update quantity: ', error);
    }
  };


    return (
      <>
        <div className="container-fluid mx-auto mt-2 py-2 rounded-0">
          <div className="w-25 mx-auto my-1">
            <h2 className="text-center text-shadow-sm">Increase Stock Quantity</h2>
          </div>
        </div>

        <div className='container w-50 mx-auto light-bg p-5 mt-5'>
          <h4 className='text-center mt-4'>How much stock would you like to add?</h4>
          <div className='w-75 mt-5 mx-auto'>
            <input
              type="number" onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity" className='form-control'
              min={1}
            />
            <div className='fit-content mx-auto'>
              <button onClick={handleEditQuantity} className='btn btn-primary mt-2'>
                Update Quantity
              </button>
              <Link to={'/products'} className='btn btn-danger mt-2 mx-1'>
                Return To List
              </Link>
            </div>

          </div>
        </div>
      </>
    );
  
};

export default EditProductQuantity;


