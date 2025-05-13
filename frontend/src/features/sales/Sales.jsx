import { useGetSalesQuery } from "./salesSlice";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import SaleItemsModal from "../saleItems/SaleItemsModal";
import CirclesSpinner from "../../assets/spinners/Circles";
import { useGetUsersQuery } from "../users/usersSlice";


export default function Sales() {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [query, setQuery] = useState(currentDate);
  const [saleId, setSaleId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const { data: sales = [], isLoading, error } = useGetSalesQuery();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetUsersQuery();
  
  const getUserById = (userId) => {
    const foundUser = users.find(user => user.id === userId);
    return foundUser ? foundUser.username : null; // Return null if product not found
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
  }

  else {
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date_time);
      const saleYear = saleDate.getFullYear();
      const saleMonth = saleDate.getMonth(); // Months are 0-indexed (January = 0)
      const saleDay = saleDate.getDate();
    
      const filterDate = new Date(query); // Convert user input to Date object
      const filterYear = filterDate.getFullYear();
      const filterMonth = filterDate.getMonth();
      const filterDay = filterDate.getDate();
    
      return saleYear === filterYear && saleMonth === filterMonth && saleDay === filterDay;
    });

    return(
      <>
        <SaleItemsModal saleId={saleId}/>
        <div className='container-fluid row light-bg mx-auto p-2 rounded-0 shadow-sm'>

          <div className="col-5">
            <label htmlFor="date-entry" className=""><small>Filter by date</small></label>
            <input
              type="date"
              className="form-control"
              id="date-entry"
              value={query} // Bind query state to input value
              onChange={(e) => setQuery(e.target.value)} // Update query state on change
            />
          </div>
        </div>

        <div className="container-fluid mt-5  py-5 light-bg shadow-sm rounded-0 w-100">
          {sales.length > 0 ? (
            <table className="w-100 mx-auto table table-striped shadow-sm">
            <thead className="bg-success py-2">
                <tr>
                <th className="py-1 pl-2"><p>DateTime</p></th>
                <th className="py-1 pl-2"><p>Sub Total</p></th>
                <th className="py-1 pl-2"><p>Tax Amount</p></th>
                <th className="py-1 pl-2"><p>Grand Total</p></th>
                <th className="py-1 pl-2"><p>Active User</p></th>
                <th className="py-1 pl-2"><p>Item(s)</p></th>
                </tr>
            </thead>
            <tbody>

                {filteredSales.map((sale) => ( 
                <tr key={sale.id} className="border-light">   
                    <td className="pl-2 py-0"><p className="my-2 font-helvetica">{new Date(sale.date_time).toLocaleString()}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{sale.sub_total}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{sale.tax_amount}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{sale.grand_total}</p></td>
                    <td className="pl-2 py-0"><p className="my-2">{getUserById(sale.user)}</p></td>
                    <td className="pl-2 py-0">
                      <button 
                          className='btn'data-bs-toggle="modal" 
                          data-bs-target="#sale-items-modal"
                          onClick={() => setSaleId(sale.id)}> <FaEllipsisH/>
                      </button>
                    </td>

                </tr>
                ))}
            </tbody>

            </table>
        

          ) : (
            <p className="text-center mt-3">No Sales found.</p>
          )}
        </div>

      </>
    )
  }
}



