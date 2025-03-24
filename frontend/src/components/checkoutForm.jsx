import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";

const CheckoutForm = ({ handleOrder, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setLoading(false);
      alert("Payment failed. Please try again.");
      return;
    }

    try {
      const response = await api.post("/api/payment-intent", {
        amount: totalPrice,
        paymentMethodId: paymentMethod.id,
      });

      const { clientSecret } = response.data;

      const confirmPayment = await stripe.confirmCardPayment(clientSecret);

      if (confirmPayment.error) {
        setLoading(false);
        alert("Payment failed. Please try again.");
      } else {
        handleOrder();
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      {loading && <h1 className="loading">Proceeding with Payment...</h1>}
      <form onSubmit={handleSubmit} className="stripe">
        <CardElement />
        <button type="submit" disabled={!stripe} className="btn clickAnimation">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
