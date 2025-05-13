import { useGetUsersQuery} from "./usersSlice"
import { useGetCurrentUserQuery } from "./usersSlice";
import CirclesSpinner from "../../assets/spinners/Circles";
import AddUserModal from "./AddUserModal";
import {FaTrash} from 'react-icons/fa' 
import {FaEdit} from 'react-icons/fa'
import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteUserModal from "./DeleteUserModal";



export default function Users() {
    const { data: currentUser = [], isLoading: currentUserLoading, error: currentUserError } = useGetCurrentUserQuery();
    const { data: users = [], isLoading, error } = useGetUsersQuery();
    const [query, setQuery] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState(0);
    if (currentUser){
        console.log(currentUser)
    }
    if (isLoading) {
        return(
          <div className='container mt-5 py-5'>
              <div className='fit-content mx-auto h-50 mt-5'>
                  <CirclesSpinner/>
              </div> 
          </div>
        )
        } else if (error) {
            return <div className="mt-5 w-50 mx-auto py-5"><p>Error: {error.message}</p></div>;
        }else {
            const filteredUsers = users.length > 0 ? users.filter(
                (user) => user.username.toLowerCase().includes(query?.toLowerCase())
              ) : [];
            return(
            <>
                <AddUserModal/>
                <small>Active User: </small>
                <Link to={'/login'}>
                 <small className="mt-0 mb-3">{localStorage.user? localStorage.user: ""}</small>
                </Link>
                
                <div className='container-fluid row light-bg mx-auto p-2 rounded-0 shadow-sm'>
                    <div className='col-9'>
                        <input type="text" className="form-control w-25" placeholder="search by username" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <div className='col-3'>
                        <button className='btn btn-success' type="button" data-bs-toggle="modal" data-bs-target="#add-user-modal">Add New User</button>
                    </div>
                </div>
                

                <h4 className="text-center mt-5">Users</h4>

                <div className="container mt-2">
                
                    <table className="table w-90 mx-auto">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Date Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                        {filteredUsers.map((user) => (

                            <tr key={user.id}>
                                <td>{user.username? user.username: 'N/A'}</td>
                                <td>{user.first_name? user.first_name: 'N/A'}</td>
                                <td>{user.last_name? user.last_name: 'N/A'}</td>
                                <td>{user.email? user.email: 'N/A'}</td>
                                <td className="font-helvetica">{user.date_joined? new Date(user.date_joined).toLocaleString(): 'N/A'}</td>
                                <td className="py-0 py-0">
                                    <div className='fit-content'>
                                        <Link to={`/users/edit/${user.id}`}> 
                                            <FaEdit className="dark-text" />
                                        </Link>
                                        <button 
                                            className='btn mx-1'  data-bs-toggle="modal"
                                            data-bs-target="#delete-user-modal" 
                                            onClick={() => {
                                                setUserIdToDelete(parseInt(user.id))
                                              }}                                            
                                            >

                                            <FaTrash className='text-danger' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <DeleteUserModal userId={userIdToDelete}/>
                </div>
                
            </>

        )
    }
}