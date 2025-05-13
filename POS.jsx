import { useState } from "react";
import { useGetProductsQuery } from "../features/products/productsSlice";

export default function PointOfSale(){
    const { data: products = [], isLoading, error } = useGetProductsQuery();
    return(
        <>
            <div className='container-fluid light-bg mx-auto mt-2 py-2 rounded-0 shadow-sm'>
                <div className="w-25 mx-auto my-1">
                    <h6 className="text-center text-shadow-sm">Point of Sale</h6>
                </div>
            </div>
            <div className="container-fluid mt-4 mb-2 py-5 light-bg rounded-0 w-100 shadow-sm">
                
                <form action="">
                    <div className="row mx-auto" style={{width: '98%'}}>
                        <div className="col-5">
                            <label htmlFor="products" className="mb-1 mx-1"><small>Select Product</small></label>
                            <input className="form-control" list="products" placeholder="type to search..." />
                            <datalist id="products">
                                {products.map((product) => (
                                    <option key={product.id} value={product.name}></option>
                                    ))}  
                            </datalist>
                        </div>
                        <div className="col-2">
                            <label htmlFor="quantity" className="mb-1 mx-1"><small>Qty</small></label>
                            <input type="number" className="form-control" defaultValue={1} />
                        </div>
                        <div className="col-2">
                            <label htmlFor="" className="mb-1 text-light">.</label>
                            <button type="submit" className="btn btn-secondary form-control">Add Item</button>
                        </div>
                    </div>
                    <div className="row bg-white shadow-sm mx-auto mt-2" style={{width:'99%'}}>
                        <div className="col-9 px-0">
                            <table className="w-100 table">
                                <thead className="medium-bg">
                                    <th className="border border-light">Qty</th>
                                    <th colSpan={6} className="border border-light">Product</th>
                                    <th className="border border-light">Price</th>
                                    <th className="border border-light">Total</th>
                                </thead>
                            </table>
                        </div>
                        <div className="col-3 medium-bg">
                            <form action="">
                                <label htmlFor="sub-total" className="mt-1">Sub Total</label>
                                <input type="text" name="sub-total" className="form-control rounded-0"/>

                                <label htmlFor="tax-inclusive" className="mt-2">Tax Inclusive(%)</label>
                                <input type="text" name="tax-inclusive" className="form-control rounded-0"/>
                                
                                <label htmlFor="tax-amount" className="mt-2">Tax Amount</label>
                                <input type="text" name="tax-amount" className="form-control rounded-0"/>

                                <label htmlFor="grand-total" className="mt-2">Grand Total</label>
                                <input type="text" name="grand-total" className="form-control rounded-0"/>

                                <button type="submit" className="btn btn-success mt-3 mb-3">Checkout</button>

                            </form>
                        </div>
                    </div>
                    
                    
                </form>
            </div>
        </>
    )
}