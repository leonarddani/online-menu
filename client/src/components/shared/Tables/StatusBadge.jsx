import React from "react";

function StatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-800";
  if (status === "available") color = "bg-green-100 text-green-800";
  else if (status === "occupied") color = "bg-red-100 text-red-800";
  else if (status === "reserved") color = "bg-amber-100 text-amber-800";

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default StatusBadge;