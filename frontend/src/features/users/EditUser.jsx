import { useGetUserByIdQuery, useEditUserMutation, usersApiSlice } from "./usersSlice";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CirclesSpinner from "../../assets/spinners/Circles";

export default function EditUser() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userId;

  const [userName, setUserName] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();


  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (user) {
      setUserName(user.username);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);

    }

  }, [user]); // Dependency array to make sure useEffect runs only when user changes
  const [editUser, { isSuccess, isError, loading=isLoading }] = useEditUserMutation();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    await editUser({
        id: parseInt(userId),
        user_name: userName,
        first_name: firstName,
        last_name: lastName,
        email
    });

    if (isSuccess) {
      navigate('/users'); // Navigate to user list
    } else if (isError) {
      console.error('Error updating user:', error);
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
  } else if (error) {
    return <div className="mt-5 w-50 mx-auto py-5"><p>Error: Could not find requested user</p></div>;
  } else {      
    return (
      <>
        <h1 className="text-center mt-2">Edit User Details</h1>
        <div className="container mt-4 w-75 mx-auto light-bg p-3 rounded-3">
          <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="mb-1 mt-2">Username</label>
                <input
                    type="text" name="username" placeholder="Username" className="form-control"
                    value={userName} onChange={(e) => setUserName(e.target.value)}
                />

                <label htmlFor="first-name" className="mb-1 mt-3">First Name</label>
                <input
                    type="text" name="first-name" placeholder="First Name"
                    className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                />

                <label htmlFor="last-name" className="mb-1 mt-3">Last Name</label>
                <input
                    type="text" name="last-name" placeholder="Last Name"
                    className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)}
                />  

                <label htmlFor="email" className="mb-1 mt-3">Email</label>
                <input
                    type="text" name="last-name" placeholder="Email"
                    className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}
                />              

                <div className="fit-content mx-auto">
                  <button className="btn btn-primary mt-4 mb-2 mx-2" type="submit">Edit User Details</button>
                  <Link to={"/users"} className="btn btn-danger mt-4 mb-2" type="submit">Return to list</Link >
                </div>

          </form>
        </div>
      </>
    );
  }
}
