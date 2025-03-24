const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://etea-nepal-backend.vercel.app"
      : "http://localhost:8000",
};

export default config;
