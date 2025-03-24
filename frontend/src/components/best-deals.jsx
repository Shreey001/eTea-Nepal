import React, { useEffect, useState } from "react";
import Card from "./card"; // Import the Card component
import api from "../api/axios";

const BestDeals = () => {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch top products data
  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const response = await api.get("/api/algorithms/best-deals");
        setCardList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching best deals:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchBestDeals();
  }, []);

  return (
    <div
      className="best-deals"
      style={{
        marginTop: "12rem",
      }}
    >
      <h1 className="heading-text">Best Deals</h1>
      {loading ? (
        <p className="loading">Loading...</p> // Show loading message while fetching data
      ) : (
        <div className="shop__container ml2 mr2">
          {cardList.map((item) => (
            <Card key={item._id} props={item} /> // Correctly pass props as an object with the expected property name
          ))}
        </div>
      )}
    </div>
  );
};

export default BestDeals;
