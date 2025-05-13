import { Link } from "react-router-dom"
import { useGetCompanyQuery } from "./companiesSlice"
import CirclesSpinner from "../../assets/spinners/Circles";

export default function CompanyDetails() {
    const { data: company, isLoading, error } = useGetCompanyQuery(1);

    if (isLoading) {
        return (
            <div className='container mt-5 py-5'>
                <div className='fit-content mx-auto h-50 mt-5'>
                    <CirclesSpinner />
                </div>
            </div>
        )
    } else if (error) {
        return <div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find company data</p></div>;
    } else {
        return (
            <>  
                
                <h5>Company Details</h5>
                <div className="card w-50 mx-auto mt-3 shadow-md rounded-5">
                    <div className="card-header rounded-top-5">
                        <h4 className="card-title text-center">{company.name}</h4>
                    </div>
                    <img src={`http://localhost:8000/${company.logo}`} alt="company logo" className="company-logo" />
                    <div className="card-body">


                        <h5 className="card-text text-center">
                            address
                        </h5>
                        <p className="text-center">{company.address}</p>

                        <h5 className="card-text text-center">
                            phone number
                        </h5>
                        <p className="text-center">{company.phone_number}</p>

                        <div className="fit-content mx-auto">

                            <Link to={`/company/edit/${1}`} className="btn btn-primary">Edit details</Link>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}