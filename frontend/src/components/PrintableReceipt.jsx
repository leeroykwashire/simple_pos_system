import { forwardRef } from "react";

const PrintableReceipt = forwardRef(({ receiptData, company }, ref) => (
  
  <div ref={ref}>
    <h6>Receipt</h6> <hr />  
    <h5 className="text-center">{company?.name || 'Jazire POS'}</h5>
    { company && 
      <>
        <p className="text-center text-secondary font-helvetica  my-0">{company.address}</p>
        <p className="text-center text-secondary font-helvetica ">{company.phone_number}</p>
      </>

    }
    <hr />
    <p className="text-secondary  font-helvetica">{receiptData.date}</p>
    {/* Display other receipt details */}
    <table className="w-90 mx-auto">
      <thead>
        <tr>
          <th>Qty</th>
          <th>Product</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {receiptData.cartItems.map((item) => (
            <tr key={item.product.id}>
              <td>x{item.quantity}</td>
              <td>{item.product.name}</td>
              <td>{((parseFloat(item.product.price)) * (parseFloat(item.quantity))).toFixed(2)}</td>
            </tr>       
        ))}        

      </tbody>
    </table> <hr />
    
    <div className="container mx-auto" style={{width:"99%"}}>
      <div className="row">
          <p className="col text-start">Total:</p>
          <p className="col text-end">${receiptData.grandTotal.toFixed(2)}</p>
        </div>
        <div className="row">
          <p className="col text-start">Tax Amount:</p>
          <p className="col text-end">${receiptData.taxAmount.toFixed(2)}</p>
        </div>
        <div className="row">
          <p className="col text-start">Tendered:</p>
          <p className="col text-end">${receiptData.tendered.toFixed(2)}</p>
        </div>
        <div className="row">
          <p className="col text-start">Change:</p>
          <p className="col text-end">${receiptData.change.toFixed(2)}</p>
        </div>
      </div>    
    </div>

)
);

export default PrintableReceipt;
