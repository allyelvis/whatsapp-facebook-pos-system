import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file

function App() {
  const [menu, setMenu] = useState([]); // Initialize as empty array
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await fetch('/api/menu'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message); // Set the error message
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToOrder = (item) => {
    setOrder([...order, item]);
    setTotal(prevTotal => prevTotal + item.price); // Use functional update
  };

  const removeFromOrder = (index) => {
    const newOrder = [...order];
    const removedItem = newOrder.splice(index, 1)[0];
    setOrder(newOrder);
    setTotal(prevTotal => prevTotal - removedItem.price); // Use functional update
  };

  const clearOrder = () => {
    setOrder([]);
    setTotal(0);
  };

  const handlePay = () => {
    // Implement payment logic here (e.g., using a payment gateway)
    alert("Payment functionality is not yet implemented."); // Placeholder
  };


  if (loading) {
    return <div className="loading">Loading menu...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Restaurant POS</h1>

      <h2>Menu</h2>
      <div className="menu">
        {menu.map((item) => (
          <div key={item.id} className="menu-item">
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p> {/* Format price */}
            <button onClick={() => addToOrder(item)}>Add to Order</button>
          </div>
        ))}
      </div>

      <h2>Order</h2>
      <div className="order">
        {order.map((item, index) => (
          <div key={index} className="order-item">
            <p>{item.name} - ${item.price.toFixed(2)}</p>
            <button onClick={() => removeFromOrder(index)}>Remove</button>
          </div>
        ))}
        {order.length === 0 && <p>Your order is empty.</p>}
      </div>

      <h2>Total: ${total.toFixed(2)}</h2>

      {order.length > 0 && (
        <div className="order-buttons"> {/* Group buttons */}
          <button onClick={clearOrder}>Clear Order</button>
          <button onClick={handlePay}>Pay</button> {/* Enable Pay button */}
        </div>
      )}
    </div>
  );
}

export default App;
