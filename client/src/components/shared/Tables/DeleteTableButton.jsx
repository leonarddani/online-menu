import React from "react";

function DeleteTableButton({ itemId, itemName, resource, endpoint, onDeleted }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token"); // or wherever you store your JWT/auth token

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // <-- Add auth header here
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete");
      }

      // Optional: Show success toast or alert here
      console.log(`${resource} "${itemName}" deleted successfully.`);

      if (onDeleted) onDeleted(itemId);
    } catch (error) {
      console.error("Delete failed:", error);
      // Optional: Show error toast or alert here
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-danger">
      Delete {resource}
    </button>
  );
}

export default DeleteTableButton;
