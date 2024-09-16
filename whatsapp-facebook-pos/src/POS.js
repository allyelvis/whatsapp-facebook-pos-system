import React, { useState } from 'react';
import { db } from './firebase';

const POS = () => {
  const [order, setOrder] = useState("");

  const handleOrder = () => {
    db.collection("orders").add({ order }).then(() => {
      alert("Order placed!");
    });
  };

  return (
    <div>
      <h1>WhatsApp & Facebook POS</h1>
      <input
        type="text"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        placeholder="Enter your order"
      />
      <button onClick={handleOrder}>Place Order</button>
    </div>
  );
};

export default POS;
