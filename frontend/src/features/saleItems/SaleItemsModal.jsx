import { useGetSaleItemsBySaleIdQuery } from "./saleItemsSlice";
import { useGetProductsQuery } from "../products/productsSlice";
  

const SaleItemsModal = ({ saleId }) => {

    const { data: saleItems, isLoading, error } = useGetSaleItemsBySaleIdQuery(saleId);
    const {data: products = [], isLoading:ProductsLoading, error:ProductsError} = useGetProductsQuery();
    const getProductById = (productId) => {
        const foundProduct = products.find(product => product.id === productId);
        return foundProduct ? foundProduct.name : null; // Return null if product not found
      };
    
        return (
            <div className="modal mt-5 mx-auto p-3" id="sale-items-modal">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content rounded-0">
                <div className="modal-body">
                    {
                        (isLoading || ProductsLoading) && (<div className="mt-5 w-50 mx-auto py-5"><h3 className="text-center">Loading...</h3></div>)
                    }
                    {
                        error && (<div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find requested sale</p></div>)
                    }
                    
                    <table className="w-90 mx-auto my-2">
                        <thead>
                            <th>Item</th>
                            <th>Quantity</th>
                        </thead>
                        <tbody>
                            {
                                saleItems && (
                                saleItems.map((item, i) =>
                                <tr key={i} >
                                    <td className="pl-2 py-0">{getProductById(parseInt(item.product))}</td>
                                    <td className="pl-2 py-0">x{item.quantity}</td>
                                </tr>
                                    //<p key={i}>{item.quantity}x {getProductById(parseInt(item.product))}</p>
                                ))
                            }
                        </tbody>
                    </table>
                    
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-danger rounded-0" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        );
    
};

export default SaleItemsModal;







