import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3002/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <>
          <h2>Today's Orders</h2>
          <ul className="orders-list">
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <span className="order-field order-name">{order.name}</span>
                <span className="order-field">Qty: {order.qty}</span>
                <span className="order-field">Price: ₹{order.price}</span>
                <span
                  className="order-field"
                  style={{ color: order.mode === "BUY" ? "green" : "red" }}
                >
                  {order.mode}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Orders;
