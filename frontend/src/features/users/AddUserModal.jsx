import { useState, useEffect } from "react";
import { useAddUserMutation } from "./usersSlice";
import { usersApiSlice } from "./usersSlice";

export default function AddUserModal() {

  const [userName, setUserName] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();

  const [message, setMessage] = useState(null);
  const clearMessage = () => {
    setMessage(null);
  }

  // Destructure useAddUserMutation
  const [addUser, { isLoading: isAdding, isSuccess, error: addUserError }] = useAddUserMutation(usersApiSlice);

  useEffect(() => {
    if (isSuccess) {
        setMessage("User added successfully!"); // Set success message
        console.log("Added successfully")
    } else if (addUserError) {
        setMessage(`Error: ${addUserError.message}`); // Set error message
        console.log("Failed to add User")
    } else {
        setMessage(null);
    }
}, [isSuccess, addUserError]); // Re-do effect when isSuccess or addUserError changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password!=repeatPassword){
        setMessage("passwords are not the same");
        throw new Error("Passwords are not the same"); 
    }

    const userData = {
      username: userName,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      is_staff: true, 
      is_active: true,
  };

    try {
      await addUser(userData);
      console.log("User added successfully!");
      // Clear the form
      setUserName("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRepeatPassword("");
    } catch (error) {
      console.error("Error adding User:", error.message);
    }
  };

  return (
    <>
      <div className="modal mt-5" id={"add-user-modal"} data-bs-backdrop="static">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Add New User</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={clearMessage}></button>
            </div>

            <div className="modal-body">

              <form onSubmit={handleSubmit}>
                <input
                  type="text" name="user-name" required
                  className="form-control" placeholder="Username"
                  value={userName} onChange={(e) => setUserName(e.target.value)}
                />
            
                <input
                  type="text" name="first-name" required
                  className="form-control mt-3" placeholder="First Name"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                /> 

                <input
                  type="text" name="last-name" required
                  className="form-control mt-3" placeholder="Last Name"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                />

                <input
                  type="email" name="email" required
                  className="form-control mt-3" placeholder="Email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password" name="password" required
                  className="form-control mt-3" placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
    
                <input
                  type="password" name="repeat-password" required
                  className="form-control mt-3" placeholder="Repeat Password"
                  value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}
                />

                <input
                  className="btn btn-success mt-3" type="submit"
                  value={isAdding ? "Adding User..." : "Add User"} disabled={isAdding} // Disable submit button while adding
                />
              </form>

              {message && (
                  <div className={isSuccess ? "alert alert-success mt-2" : "alert alert-danger mt-2"}>
                      {message}
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
