import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Import Sonner's toast function
import { Minus, Plus, Trash } from "lucide-react";

// Main component
export default function TableOrderPage({ id }) {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("pizza");

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:8095/api/tables/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Add item to cart
  const addToCart = async (itemId, quantity, notes) => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${id}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity, notes }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart); // Update cart state
      } else {
        console.error("Error adding item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${id}/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart); // Update cart state
      } else {
        console.error("Error removing item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${id}/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart); // Update cart state
      } else {
        console.error("Error updating item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8095/api/tables/${id}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Order for Table ${id} has been sent to the kitchen`); // Using Sonner to show the toast
        console.log("Order placed:", data);
        navigate("/dashboard/waiter/tables"); // Redirect to tables page
      } else {
        console.error("Error placing order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // Filter menu items based on active tab (pizza, pasta, salad, drink)
  const filteredItems = menuItems.filter((item) => item.category === activeTab);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table {id}</h1>
          <p className="text-muted-foreground">Place an order for this table</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to Tables
        </Button>
      </div>

      {/* Menu and Cart */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menu Card */}
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
            <CardDescription>Select items to add to the order</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pizza" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pizza">Pizza</TabsTrigger>
                <TabsTrigger value="pasta">Pasta</TabsTrigger>
                <TabsTrigger value="salad">Salad</TabsTrigger>
                <TabsTrigger value="drink">Drinks</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => addToCart(item.id, 1, "")}>Add</Button>
                  </div>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Cart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Order</CardTitle>
            <CardDescription>Items in the current order</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No items in the order yet</div>
            ) : (
              <div className="space-y-4">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{cartItem.item.name}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(cartItem.item.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">
                        ${cartItem.item.price.toFixed(2)} × {cartItem.quantity} = $
                        {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{cartItem.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`notes-${cartItem.item.id}`} className="text-sm">
                        Special Instructions
                      </Label>
                      <Textarea
                        id={`notes-${cartItem.item.id}`}
                        placeholder="Any special requests..."
                        className="mt-1"
                        value={cartItem.notes}
                        onChange={(e) => {
                          const updatedCart = cart.map((item) =>
                            item.item.id === cartItem.item.id
                              ? { ...item, notes: e.target.value }
                              : item
                          );
                          setCart(updatedCart);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0).toFixed(2)}</span>
            </div>
            <Button onClick={placeOrder} disabled={cart.length === 0} className="w-full">
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
