import { useState, useEffect } from "react";
import { BarGraph } from "./BarGraph";
import { Link } from "react-router-dom";
import { useGetMonthlySalesQuery } from "../features/sales/salesSlice";
import { useGetDailySalesQuery } from "../features/sales/salesSlice";
import { useGetTopProductMonthlyQuery } from "../features/sales/salesSlice";
import { useGetProductsQuery } from "../features/products/productsSlice";
import { useGetTopProductsYearlyQuery } from "../features/sales/salesSlice";


export default function Reports(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const [selectedChart, setSelectedChart] = useState("")
    const { data: monthlySales = [], isLoading:isLoadingMonthlySales, error:monthlySalesError } = useGetMonthlySalesQuery(parseInt(currentYear));
    const { data: dailySales = [], isLoading:isLoadingDailySales, error:dailySalesError } = useGetDailySalesQuery();
    const { data: topProductsMonthly = [], isLoading:isLoadingTopProductsMonthly, error:TopProductsMonthlyError } = useGetTopProductMonthlyQuery();
    const {data: products = [], isLoading:ProductsLoading, error:ProductsError} = useGetProductsQuery();
    
    const { data: topProductsYearly = [], isLoading:isLoadingTopProductsYearly, error:TopProductsYearlyError } = useGetTopProductsYearlyQuery(parseInt(currentYear));
    const TopProductsArray = Object.entries(topProductsYearly).map(([productId, sales]) => ({
        productId,
        sales
      }));
      
    // Sort products by sales in descending order
    TopProductsArray.sort((a, b) => b.sales - a.sales);

    const getProductById = (productId) => {
        const foundProduct = products.find(product => product.id === productId);
        return foundProduct ? foundProduct.name : null; // Return null if product not found
      };
    
    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    const monthlySalesData = {
        labels: monthlySales.map(sale => monthNames[sale.month - 1]),
        datasets: [
            {
                label: 'Total Sales',
                data: monthlySales.map((sale) => sale.total_sales),
                backgroundColor: 'rgba(2, 16, 29, 0.863)',
                borderColor: 'rgba(2, 16, 29, 1)',
                borderWidth: 1
            }
        ]
    };

      
    const dailySalesData = {
    labels: dailySales.map(sale => new Date(sale.day).getDate()), // Format dates for display
    datasets: [
        {
        label: 'Daily Sales',
        data: dailySales.map(sale => sale.total_sales),
        backgroundColor: 'rgba(2, 16, 29, 0.863)',
        borderColor: 'rgba(2, 16, 29, 1)',
        borderWidth: 1
        }
    ]
    };
    const topProductsMonthlyData = {
        labels: Object.keys(topProductsMonthly).map(month => {
            const productId = topProductsMonthly[month].most_sold_product_id;
            return `${monthNames[month - 1]} (${getProductById(productId) || 'Loading'})`;
          }),
        datasets: [
          {
            label: 'Total Sales',
            data: Object.values(topProductsMonthly).map(product => product.total_quantity),
            backgroundColor: 'rgba(2, 16, 29, 0.863)',
            borderColor: 'rgba(2, 16, 29, 1)',
            borderWidth: 1
          }
        ]
      };
      const topYearlySalesData = {
        labels: TopProductsArray.map(product => {
            const productName = getProductById(parseInt(product.productId));
            console.log('productName:', productName); // Log the returned product name
            return productName || `Product ${product.productId}`;
          }),
        datasets: [
          {
            label: 'Yearly Sales',
            data: TopProductsArray.map(({ sales }) => sales),
            backgroundColor: 'rgba(2, 16, 29, 0.863)',
            borderColor: 'rgba(2, 16, 29, 1)',
            borderWidth: 1
          }
        ]
      };
    const isAdminUser = JSON.parse(localStorage.isAdmin)
    if (!isAdminUser){
        return(
            <>
                <div className="mx-auto fit-content p-5 mt-5">
                    <h6>Sorry, Only admin may access this page</h6>
                    <Link to={'/login'}> <p className="text-center">Login page</p> </Link>
                </div>
                
            </>
        )
    }else{       
    return(
        <>
            <div className="container-flex row mb-5 light-bg py-2  shadow-sm">
                <div className="col-8">
                    <h4 className="my-1">Sales Reports</h4>
                </div>
                <div className="col-4">
                    <select name="graphs" id="graph-select" onChange={handleChartChange} className="form-select">
                        <option value="" readOnly disabled selected>Select chart to view</option>
                        <option value="sales-per-month">Total Sales revenue per month</option>
                        <option value="sales-per-day">Total Sales revenue per day</option>
                        <option value="top-product-monthly">Most sold product of each month</option>
                        <option value="top-products-yearly">Most sold products for the year</option>
                    </select>
                </div>
            </div>
  
                
            {selectedChart === "" && (
                <div className="fit-content mx-auto position-relative">
                <img src="reportsCover.jpeg" alt="cover image" className="sales-img rounded-5 shadow-sm"/>   
                <div className="position-absolute top-50 start-50 translate-middle">
                    <p className="text-light">
                        On this page you are able to view graphical representation of the performance of your 
                        products and your business in general, all you need to do is select the graph you wish to view. 
                    </p>
                </div>
        </div>                
            )}           
            {
            selectedChart === "sales-per-day" && (
            dailySalesError ? (
                <p>Error fetching sales data.</p>
            ) : isLoadingDailySales ? (
                <p>Loading sales data...</p>
            ) : (
                <BarGraph chartData={dailySalesData} headText={`Total sales revenue per day this month`} />
            )   
            )
            }

            {
            selectedChart === "sales-per-month" && (
            monthlySalesError ? (
                <p>Error fetching sales data.</p>
            ) : isLoadingMonthlySales ? (
                <p>Loading sales data...</p>
            ) : (
                <BarGraph chartData={monthlySalesData} headText={`Total sales revenue per month of the year ${currentYear}`} />
            )   
            )
            }

            {
            selectedChart === "top-product-monthly" && (
            TopProductsMonthlyError ? (
                <p>Error fetching top products data.</p>
            ) : isLoadingTopProductsMonthly ? (
                <p>Loading top products data...</p>
            ) : (
                <BarGraph chartData={topProductsMonthlyData} headText={`Highest selling product for each month for the year ${currentYear}`} />
            )   
            )
            }

            {selectedChart === "top-products-yearly" && (
            TopProductsYearlyError ? (
                <p>Error fetching top products data.</p>
            ) : isLoadingTopProductsYearly ? (
                <p>Loading top products data...</p>
            ) : (
                <BarGraph chartData={topYearlySalesData} headText={`Most sold products of the year ${currentYear}`} />
            )
            )}
        </>
    )}
}