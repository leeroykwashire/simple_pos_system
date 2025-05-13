import { useState, useEffect } from "react";
import { useDeleteUserMutation } from "./usersSlice";
import { usersApiSlice } from "./usersSlice";

export default function DeleteUserModal({ userId }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletionMessage, setDeletionMessage] = useState(null);

    const [deleteUser, { isSuccess, isError, error }] = useDeleteUserMutation(usersApiSlice);

    useEffect(() => {
        if (isSuccess) {
            setDeletionMessage("Deleted successfully!"); // Set success message
            console.log("Deleted successfully")
        } else if (isError) {
            setDeletionMessage(`Error: ${error.message}`); // Set error message
            console.log("Failed to delete user")
        } else {
            setDeletionMessage(null);
        }
    }, [isSuccess, isError]); // Re-do effect when isSuccess or isError changes

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser(userId);
        } catch (error) {
            console.error("Error deleting user:", error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeModal = () => {
        setDeletionMessage(null); // Reset message when modal closes
    };

    return (
        <>
            <div className="modal" id={"delete-user-modal"} data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content mt-5 mx-auto rounded-0">
                        <div className="modal-header">
                            <h4 className="modal-title">Delete User</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            {deletionMessage && (
                                <div className={isSuccess ? "alert alert-success mt-2" : "alert alert-danger mt-2"}>
                                    {deletionMessage}
                                </div>
                            )}
                            {deletionMessage === null && (
                                <>
                                    <p>The selected user will be deleted.</p>
                                    <button className="btn btn-danger rounded-0" disabled={isDeleting} onClick={handleDelete}>
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
