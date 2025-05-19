import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button"; // Assuming you have a Button component.
import { Pencil, Trash } from "lucide-react"; // Assuming you're using react-icons for the Pencil and Trash icons.
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/Table"; // Adjust to your table component library.

const TablesList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8095/api/tables");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTables(data.tables);
      } catch (error) {
        setError("Error fetching tables: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tables List</h1>

      {loading && <p>Loading tables...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {tables.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Number</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium capitalize">
                  {table.table_number}
                </TableCell>
                <TableCell>{table.capacity}</TableCell>
                <TableCell>{table.status}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link to={`/edit-table/${table.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-bold capitalize mb-2">
                Table {table.table_number}
              </h2>
              <p className="text-gray-500 mb-4">Capacity: {table.capacity}</p>
              <p className="text-gray-500 mb-4">Status: {table.status}</p>
              <div className="flex justify-end gap-2">
                <Link to={`/edit-table/${table.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil />
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TablesList;
