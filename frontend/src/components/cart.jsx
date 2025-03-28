import React, { useState, useEffect, useContext } from "react";
import { cartContext, showCart, buy } from "../helper/context";
import axios from "axios";
import close from "../Assets/icons/close.svg";
import deleteIcon from "../Assets/icons/delete.svg";
import tea from "../Assets/teabag.png";
import CheckoutForm from "./checkoutForm"; // Import the CheckoutForm
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

const Cart = () => {
  const { cart, setCart } = useContext(cartContext);
  const { cartShow, setCartShow } = useContext(showCart);
  const { buyNow, setBuyNow } = useContext(buy);
  const [checkout, setCheckout] = useState(false);

  const deliveryPrice = 100;

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  let totalPrice = 0;

  const data = cart
    .filter((item) => item[0].quantity > 0)
    .map((item) => {
      totalPrice += item[0].price * item[0].quantity;
      return item[0];
    });

  totalPrice = parseFloat(totalPrice.toFixed(2));

  const itemQuantity = (sign, image, price, cutPrice, discount, name) => {
    const updatedCart = cart
      .map((item) => {
        if (
          item[0].image === image &&
          item[0].price === price &&
          item[0].cutPrice === cutPrice &&
          item[0].discount === discount &&
          item[0].name === name
        ) {
          if (sign === "+") {
            item[0].quantity += 1;
            item[0].totalQuantity += 1;
          } else if (sign === "-" && item[0].quantity > 0) {
            item[0].quantity -= 1;
            item[0].totalQuantity -= 1;
          }
        }
        return item;
      })
      .filter((item) => item[0].quantity > 0);

    setCart(updatedCart);
  };

  const deleteItem = (image, price, cutPrice, discount, name) => {
    const updatedCart = cart.filter((item) => {
      return !(
        item[0].image === image &&
        item[0].price === price &&
        item[0].cutPrice === cutPrice &&
        item[0].discount === discount &&
        item[0].name === name
      );
    });
    setCart(updatedCart);
  };

  const isValueMoreThanStock = () => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i][0].quantity > cart[i][0].stock) {
        alert(`You're Exceeding Stock for product named ${cart[i][0].name}`);
        setCheckout(false);
        return;
      }
    }

    setCheckout(true);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await api.post("/api/orders", {
        products: cart.map((item) => ({
          productId: item[0]._id,
          quantity: item[0].quantity,
        })),
        totalAmount: totalPrice + deliveryPrice,
        shippingAddress: localStorage.getItem("address"),
        mobileNumber: localStorage.getItem("mobileNumber"),
        buyerName: localStorage.getItem("name"),
      });

      // Clear cart after successful order
      localStorage.removeItem("cart");
      setCart([]);
      alert("Order placed successfully!");
      window.location.href = "/orders";
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div
      className="cart__container"
      id={cartShow || buyNow.length > 0 ? "cartShow" : ""}
    >
      <div
        className="cart__container__close"
        id={buyNow.length > 0 ? "dn" : ""}
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div className="cart__container__close__image">
          <img src={close} alt="close icon" />
        </div>
        <span>Close</span>
      </div>
      <div
        className="cart__container__container"
        id={checkout || buyNow.length > 0 ? "dn" : ""}
      >
        {data.length > 0 ? (
          data.map((d) => (
            <div key={d.name} className="cart__container__content">
              <div className="cart__container__content__upper">
                <div className="cart__container__content__upper__image">
                  {!d.image ? (d.image = "") : ""}
                  <img
                    src={getImageUrl(d.image)}
                    alt={d.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/LOGO.svg"; // Fallback to logo if product image fails to load
                    }}
                  />
                </div>
                <div className="cart__container__content__upper__details">
                  <span>
                    Rs {d.price} <li>{d.cutPrice}</li>
                    <button>{d.stock} left</button>
                  </span>
                  <h6>{d.name}</h6>
                  <span>
                    <button
                      onClick={() =>
                        itemQuantity(
                          "-",
                          d.image,
                          d.price,
                          d.cutPrice,
                          d.discount,
                          d.name
                        )
                      }
                    >
                      -
                    </button>
                    <h5>{d.quantity}</h5>
                    <button
                      onClick={() =>
                        itemQuantity(
                          "+",
                          d.image,
                          d.price,
                          d.cutPrice,
                          d.discount,
                          d.name
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        deleteItem(
                          d.image,
                          d.price,
                          d.cutPrice,
                          d.discount,
                          d.name
                        )
                      }
                    >
                      <div className="image__container">
                        <img src={deleteIcon} alt="delete icon" />
                      </div>
                      <span>Delete</span>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="cart__container__empty">Empty Cart</h2>
        )}
      </div>

      <div className="cart__container__content__lower">
        <hr />
        <span>
          <h6>Total</h6>
          <h5>
            Rs{" "}
            {buyNow.length > 0 ? buyNow[2] : totalPrice ? totalPrice : "0.00"}
          </h5>
        </span>
        <span>
          <h6>Delivery</h6>
          <h5>Rs 100</h5>
        </span>
        <span>
          <h6>Sub-Total</h6>
          <h5>Rs {totalPrice + deliveryPrice}</h5>
        </span>
        <span>
          <button
            className="clickAnimation"
            onClick={() => {
              setCartShow(false);
              setCheckout(false);
              setBuyNow([]);
            }}
          >
            Cancel
          </button>
          <button
            className="clickAnimation"
            onClick={() => isValueMoreThanStock()}
          >
            Checkout
          </button>
        </span>
      </div>

      <div className="stripe__wrapper">
        {checkout && totalPrice > 0 && (
          <CheckoutForm
            handleOrder={handlePlaceOrder}
            totalPrice={totalPrice + deliveryPrice}
          /> // Render the CheckoutForm here
        )}
      </div>
    </div>
  );
};

export default Cart;
