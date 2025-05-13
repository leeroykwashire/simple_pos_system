import { useEditCompanyMutation, useGetCompanyQuery } from "./companiesSlice";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CirclesSpinner from "../../assets/spinners/Circles";
import { useChangeCompanyLogoMutation } from "./companiesSlice";

export default function EditCompanyDetails() {
    const navigate = useNavigate();
    const params = useParams();
    const companyId = params.companyId;

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [previewImg, setPreviewImg] = useState("");

    //destructure the mutation hooks

    const [updateCompany, { isLoading: updateCompanyLoading, isSuccess: updateCompanySuccess, error: updateCompanyError }] =
        useEditCompanyMutation();

    const [changeCompanyLogo, { isLoading: changeLogoLoading, isSuccess: changeLogoSuccess, error: changeLogoError }] = 
        useChangeCompanyLogoMutation();

    const { data: company, isLoading, error } = useGetCompanyQuery(companyId);

    useEffect(() => {
        if (company) {
            setName(company.name);
            setAddress(company.address)
            setPhoneNumber(company.phone_number)
            if (company.logo) {
                setPreviewImg(company.logo); // Set image URL for preview
                
            }
        }
    }, [company]); // Dependency array to make sure useEffect runs only when company changes

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
    
        // Basic validation
        if (!file || file.type.split('/')[0] !== 'image') {
          console.error('Invalid file type. Please upload an image.');
          return;
        }
    
        const formData = new FormData();
        formData.append('logo', file);
    
        try {
          await changeCompanyLogo({ companyId, logoData: formData });
    
          if (changeLogoSuccess) {
            console.log('Company logo updated successfully!');
            // Handle successful update
          }

        } catch (err) {
          console.error('Error updating company logo:', err);
          
        }
      };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        await updateCompany({
            id: companyId,
            name,
            address,
            phone_number: phoneNumber,
        });

        if (updateCompanySuccess) {
            console.log('Success');
            navigate('/company'); // Navigate to company details page
        } else if (updateCompanyError) {
            console.error('Error updating company details:', error);
        }
    };

    if (isLoading || updateCompanyLoading) {
        return(
          <div className='container mt-5 py-5'>
              <div className='fit-content mx-auto h-50 mt-5'>
                  <CirclesSpinner/>
              </div> 
          </div>
        )
    } else if (error) {
        return <div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find company data</p></div>;
    } else {
        return (
            <>
                <h1 className="text-center mt-2 mb-5">Edit Company Details</h1>
                <div className="container mt-5 w-50 w-75-sm mx-auto light-bg p-3 rounded-3">
                    <form>
                        <label htmlFor="name" className="mt-4 mx-1">Name</label>
                        <input 
                            type="text" name="name" placeholder="name"
                            className="form-control" value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="address" className="mt-4 mx-1">Address</label>
                        <input 
                            type="text" name="address" placeholder="address"
                            className="form-control" value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <label htmlFor="phone-number" className="mt-4 mx-1">Phone Number</label>
                        <input 
                            type="text" name="phone-number" placeholder="e.g +263778104368"
                            className="form-control" value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <label htmlFor="logo" className="form-label mt-4">Company Logo/Image</label>
                        {previewImg && (
                        <img src={previewImg} alt="Company Logo" className="img-thumbnail" />
                        )}
                        <input
                        type="file"
                        name="logo"
                        id="logo"
                        className="form-control"
                        onChange={handleImageUpload}
                        />

                        <div className='fit-content mx-auto mt-4 mb-2'>
                            <button className="btn btn-primary" onClick={handleSubmit}>Edit Details

                            </button>
                            <Link to={'/company'} className='btn btn-danger mx-1'>
                                Return To details page
                            </Link>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}
