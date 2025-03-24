const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://e-tea-nepal-bked.vercel.app/"
      : "http://localhost:8000",
};

export default config;
