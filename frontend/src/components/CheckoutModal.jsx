import { useState, useEffect } from "react";
import CirclesSpinner from "../assets/spinners/Circles";
import ReceiptModal from "./ReceiptModal";


const CheckoutModal = ({cartItems, subTotal, taxRate, taxAmount, grandTotal, onCheckout}) => {
  const [amountTendered, setAmountTendered] = useState(0);
  const [change, setChange] = useState(0); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");  
  const [isLoading, setIsLoading] = useState(false);
  const day = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()
  const date = `${day}, ${time}`

  const [receiptAmountTendered, setReceiptAmountTendered] = useState(0);
  const [receiptChange, setReceiptChange] = useState(0);

  useEffect(() => {
    setChange(parseInt(amountTendered - grandTotal, 0));
  }, [amountTendered]);

  const handleAmountTenderedChange = (event) => {
    const value = parseFloat(event.target.value);
    setAmountTendered(value);
     // Ensure change is always positive
  }; 
  
  const clearErrorMessage = () => {
    setErrorMessage("");
  }

  const clearSuccessMessage = () => {
    setSuccessMessage("");
  }

  const clearValues = () => {
    setAmountTendered(0);
    setChange(0);
  }
  const clearAllValues = () => {
    clearValues();
    setErrorMessage("")
    setSuccessMessage("")
  }
  
  const handleConfirmCheckout = async () => {
    // Validate amountTendered
    if (amountTendered < grandTotal) {
      setErrorMessage("The amount tendered is less than the amount due");
      return;
    }
  
    setIsLoading(true); // Set loading state to true
    try {
      await onCheckout(cartItems, subTotal, taxAmount, grandTotal);
      setSuccessMessage("Checkout successful!");
      setReceiptAmountTendered(amountTendered)
      setReceiptChange(change)
    } catch (error) {
      // Handle checkout error (e.g., display error message)
      console.error("Checkout failed:", error.message);
      setErrorMessage(error.message); // Set the error message state
    } finally {
      setIsLoading(false);

      clearValues();
    }
  };

  const receiptData = {
      date: date,
      tendered: receiptAmountTendered,
      change: receiptChange,
      cartItems: cartItems,
      subTotal,
      taxAmount,
      grandTotal,
  };

    return (
      <>
        <ReceiptModal receiptData={receiptData}/>
        <div className="modal mt-5 mx-auto p-3" id="checkout-modal" data-bs-backdrop="static">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                  {(errorMessage==="" && successMessage==="") &&
                    <h6>Checkout</h6>
                  }
                  
                  {errorMessage !=="" &&
                    <div className="alert alert-danger alert-dismissable fade show w-90 mx-auto my-1" role="alert">
                      {errorMessage}
                      <button type="button" onClick={clearErrorMessage} className="btn-close" data-bs-dismiss="alert" aria-label="close"></button>
                    </div>
                    
                  }
                  {successMessage !=="" &&
                    <div className="alert alert-success w-75 mx-auto" role="alert">
                      <p className="text-center">{successMessage}</p>
                     
                    </div>
                    
                  }
              </div>
              
              <div className="modal-body">
                {isLoading &&
                (
                  <div className='container'>
                    <div className='fit-content mx-auto h-50 mt-5'>
                        <CirclesSpinner/>
                    </div> 
                </div>
                )
                }
                <form action="">
                  <label htmlFor="payable-amount">Payable Amount</label>
                  <input type="number" className="form-control" value={grandTotal} readOnly />

                  <label htmlFor="amount-tendered" className="mt-3">Amount Tendered</label>
                  <input type="number" className="form-control" value={amountTendered} onChange={handleAmountTenderedChange} />

                  <label htmlFor="change" className="mt-3">Change</label>
                  <input type="number" className="form-control mb-3" style={change>=0?{color:"green"}: {color:"red"}} value={change} readOnly />
                </form>
              </div>
    
              <div className="modal-footer">
                {successMessage==="" &&
                  <button type="button" className="btn btn-success" onClick={handleConfirmCheckout}>Confirm</button>              
                }
                {successMessage &&
                  <button
                  className="btn btn-secondary mt-3 mb-3 mx-1 rounded-0" type="button" data-bs-toggle="modal"
                  data-bs-target="#receipt-modal" onClick={clearSuccessMessage}>View Receipt
                </button>              
                }
                <button type="button" onClick={clearAllValues} className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </>

    );
  };
  
  export default CheckoutModal; 
  