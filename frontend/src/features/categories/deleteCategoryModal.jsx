import { useState, useEffect } from "react";
import { useDeleteCategoryMutation } from "./categoriesSlice";
import { categoriesApiSlice } from "./categoriesSlice";
import { productsApiSlice } from "../products/productsSlice";
import { useDispatch } from "react-redux";

export default function DeleteCategoryModal({ categoryId }) {

    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletionMessage, setDeletionMessage] = useState(null);

    const [deleteCategory, { isSuccess, isError, error }] = useDeleteCategoryMutation(categoriesApiSlice);

    useEffect(() => {
        if (isSuccess) {
            setDeletionMessage("Deleted successfully!"); // Set success message
            console.log("Deleted successfully")
        } else if (isError) {
            setDeletionMessage(`Error: ${error.message}`); // Set error message
            console.log("Failed to delete category")
        } else {
            setDeletionMessage(null);
        }
    }, [isSuccess, isError]); // Re-do effect when isSuccess or isError changes

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCategory(parseInt(categoryId));
        } catch (error) {
            console.error("Error deleting category:", error.message);
        } finally {
            setIsDeleting(false);
            dispatch(productsApiSlice.util.invalidateTags(['Product']));
        }
    };

    const closeModal = () => {
        setDeletionMessage(null); // Reset message when modal closes
    };

    return (
        <>
            <div className="modal mt-5 mx-auto" id={"delete-category-modal"} data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content mt-5 rounded-0">
                        <div className="modal-header">
                            <h4 className="modal-title">Delete Category</h4>
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
                                    <p>The selected category will be deleted.</p>
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
