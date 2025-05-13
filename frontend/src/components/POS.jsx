import { useGetProductsQuery } from "../features/products/productsSlice";
import { useAddSaleMutation } from "../features/sales/salesSlice";
import { useAddSaleItemMutation } from "../features/saleItems/saleItemsSlice";
import { useState, useEffect, useRef} from "react";
import { FaTrash } from 'react-icons/fa';
import CirclesSpinner from "../assets/spinners/Circles";
import { useDispatch } from "react-redux";
import { productsApiSlice } from "../features/products/productsSlice";
import CheckoutModal from "./CheckoutModal";
import { useGetUserByNameQuery } from "../features/users/usersSlice";


export default function PointOfSale() {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0.0);
  const [taxRate, setTaxRate] = useState(0.0);
  const [taxAmount, setTaxAmount] = useState(0.0);
  const [grandTotal, setGrandTotal] = useState(0.0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const productSelectRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { isLoading, error, data } = useGetProductsQuery();
  const [products, setProducts] = useState([]);
  
  const clearCart = () => {
    setCartItems([])
  }


  // Destructure the mutation functions  
  const [createSale, { isLoading: createSaleLoading, isSuccess: createSaleSuccess, error: createSaleError }] = 
    useAddSaleMutation();
  
  const [createSaleItem, { isLoading: createSaleItemLoading, isSuccess: createSaleItemSuccess, error: createSaleItemError }] =
      useAddSaleItemMutation();

  const { data: user, isLoading: getUserLoading } = useGetUserByNameQuery(localStorage.user);  

     
  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    calculateTotals();

  }, [cartItems]); // Re-calculate totals whenever cartItems changes

  const handleProductSelection = (event) => {
    const selectedProductId = parseInt(event.target.value);
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    setSelectedProduct(selectedProduct);
  };

  const handleQuantityChange = (event, productId) => {
    setSelectedQuantity(event.target.value)
    const newQuantity = parseInt(event.target.value, 10);
    const index = cartItems.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      const updatedCartItems = cartItems;
      updatedCartItems[index] = { ...updatedCartItems[index], quantity: newQuantity };
      setCartItems(updatedCartItems);
      console.log(cartItems[index])
      calculateTotals();
    }
  };

  const handleAddItem = () => {
    if (selectedProduct) {
      const itemExists = cartItems.some(item => item.product.id === selectedProduct.id);

      if (!itemExists) {
        const newItem = { product: selectedProduct, quantity: selectedQuantity };
        setCartItems([...cartItems, newItem]);
        setSelectedProduct(null); // Clear selected product after adding
        setSelectedQuantity(1); // Reset quantity
        calculateTotals();
        productSelectRef.current.value = ''; // Clear the input value
        productSelectRef.current.dispatchEvent(new Event('change')); // Trigger change event
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage("Item already in cart"); // Set error message
        clearErrorMessage(); // Clear error message after use
      }
    } else {
      setErrorMessage("Item does not exist"); // Set error message
      clearErrorMessage(); // Clear error message after use
    }
  };

  const clearErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000); // Clear error message after 3 seconds
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.product.id !== itemId);
    setCartItems(updatedCartItems);
    calculateTotals();
  };



  const calculateTotals = () => {
    let total = Number(0.0);
    cartItems.forEach((item) => {
      const price = parseFloat(item.product.price);
      const productTotal = price * parseFloat(item.quantity);
      //console.log("Product:", item.product.id, "Price:", price, "Quantity:", item.quantity, "Product Total:", productTotal);
      total += parseFloat(productTotal.toFixed(2)); // Convert back to number
    });
    console.log("Subtotal before rounding:", total);

    // Set subTotal as a formatted string **after calculating total**
    const formattedSubTotal = total.toFixed(2);
    console.log("Formatted SubTotal:", formattedSubTotal); // Debugging log
    setSubTotal(parseFloat(formattedSubTotal)); // Ensure subTotal is a number

    // Calculate grandTotal based on the formatted subTotal
    setGrandTotal(parseFloat(formattedSubTotal) + taxAmount);
  };


  const handleCheckout = async () => {
    try {
      // 1. Check stock quantities for all items in the cart
      for (const cartItem of cartItems) {
        const product = products.find(p => p.id === cartItem.product.id);
        if (!product) {
          throw new Error(`Product not found: ${cartItem.product.name}`);
        }
        if (product.stock_quantity < parseInt(cartItem.quantity)) {
          throw new Error(`Insufficient stock for product: ${cartItem.product.name}`);
        }
      }
      
      // 2. Create a new Sale object
      const saleData = {
        sub_total: subTotal,
        tax_amount: taxAmount,
        grand_total: grandTotal,
        user: user?user.id:1, // Assuming user ID is readily available
      };
  
      // Call the mutation function with error handling
      const addSaleResponse = await createSale(saleData);
      if (createSaleError) {
        console.error('Error creating Sale:', createSaleError.message);
        throw new Error('Sale creation failed'); // Re-throw for component-level handling
      }
  
      // Extract the newly created Sale ID
      const createdSaleId = addSaleResponse.data.id;
  
      // 3. Create SaleItem objects (one for each item in cart)
      for (const cartItem of cartItems) {
        const saleItemData = {
          sale: parseInt(createdSaleId),
          product: parseInt(cartItem.product.id), // Assuming product ID is in cartItem
          quantity: parseInt(cartItem.quantity),
        };
  
        console.log(saleItemData);
  
        // Call the mutation function with error handling
        const addSaleItemResponse = await createSaleItem(saleItemData);
        if (createSaleItemError) {
          console.error('Error creating SaleItem:', createSaleItemError.message);
          throw new Error('Sale item creation failed'); // Re-throw for component-level handling
        }
      }
  
      // Handle successful checkout
      console.log('Checkout successful!');
      
      dispatch(productsApiSlice.util.invalidateTags(['Product']));
      // Clear cart items
      // Display confirmation message
    } catch (error) {
      // Handle errors gracefully (e.g., display error message to user)
      console.error('Checkout error:', error.message);
      throw error;
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
}

else if (error) {
  return <div className="mt-5 w-50 mx-auto py-5"><p>Error: {error.message}</p></div>;
} else {
  return (
    <>
      <div className="container-fluid light-bg mx-auto mt-2 py-2 rounded-0">
        <div className="w-25 mx-auto my-1">
          <h6 className="text-center">Point of Sale</h6>
        </div>
      </div>
      <div className="container-fluid mt-4 mb-2 py-5 light-bg rounded-0 w-100">
        {errorMessage && <div className="alert alert-danger py-1 rounded-0" role="alert">{errorMessage}</div>}
        <form action="" className="mx-auto" style={{ width: "99%" }}>
          <div className="row" >
            <div className="col-5">
              <label htmlFor="products" className="mb-1 mx-1">
                <small>Select Product</small>
              </label>

              <input className="form-control rounded-0" list="products-datalist" placeholder="type to search..." onChange={handleProductSelection} ref={productSelectRef} />
              <datalist id="products-datalist">
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </datalist>
            </div>

            <div className="col-2">
              <label htmlFor="quantity" className="mb-1 mx-1">
                <small>Qty</small>
              </label>
              <input type="number" className="form-control rounded-0" onChange={(e) => handleQuantityChange(e)} min={1} value={selectedQuantity} />

            </div>
            <div className="col-2">
              <label htmlFor="" className="mb-1 text-light">.</label>
              <button className="btn btn-secondary form-control border rounded-0" onClick={handleAddItem} type="button">Add Item</button>
            </div>

            <div className="col-2">
              <label htmlFor="" className="mb-1 text-light">.</label>
              <button className="btn btn-light form-control border rounded-0" onClick={clearCart} type="button">Clear Items</button>
            </div>
          </div>
        </form>
        <div className="row bg-white shadow-sm mx-auto mt-3" style={{ width: '99%' }}>
          <div className="col-9 px-0">
            <table className="w-100 table">
              <thead>
                <tr>
                  <th className="border border-right">Action</th>
                  <th className="border border-right">Product</th>
                  <th className="border border-right">Price</th>
                  <th className="border border-right">Total</th>
                  <th className="border border-right">Qty</th>
                </tr>
              </thead>
              <tbody className="mt-2">
                {cartItems.map((item, index) => (
                  <tr key={index}>

                    <td className="border-0">
                      <button type="button" className="bg-white border-0" onClick={() => handleRemoveItem(item.product.id)}><FaTrash className="text-danger" /></button>
                    </td>
                    <td className="border-0">{item.product.name}</td>
                    <td className="border-0">{item.product.price}</td>
                    <td className="border-0">{(item.product.price * item.quantity).toFixed(2)}</td>

                    <div className="w-50 py-1" style={{ height: '35px' }}>
                      <td className="w-50 border-0">
                        <input type="number" className="form-control" min={1} value={item.quantity} onChange={(e) => handleQuantityChange(e, item.product.id)} style={{ height: '35px' }} />
                      </td>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-3 medium-bg">
            <form action="">
              <label htmlFor="sub-total" className="mt-1">Sub Total</label>
              <input type="text" name="sub-total" className="form-control rounded-0" value={subTotal.toFixed(2)} readOnly />

              <label htmlFor="tax-inclusive" className="mt-2">Tax Inclusive(%)</label>
              <input type="text" name="tax-inclusive" className="form-control rounded-0" value={taxRate} readOnly />

              <label htmlFor="tax-amount" className="mt-2">Tax Amount</label>
              <input type="text" name="tax-amount" className="form-control rounded-0" value={taxAmount.toFixed(2)} readOnly />

              <label htmlFor="grand-total" className="mt-2">Grand Total</label>
              <input type="text" name="grand-total" className="form-control rounded-0" value={grandTotal.toFixed(2)} readOnly />

              
              <button
                type="button"
                className="btn btn-success mt-3 mb-3 rounded-0"
                data-bs-toggle="modal"
                data-bs-target="#checkout-modal"
              >
                Checkout
              </button>
              
                <CheckoutModal
                cartItems={cartItems}
                subTotal={subTotal}
                taxRate={taxRate}
                taxAmount={taxAmount}
                grandTotal={grandTotal}
                onCheckout={handleCheckout} // Pass handleCheckout function as a prop
              />
            
            </form>
          </div>
        </div>
      </div>
    </>
  );
  }
}