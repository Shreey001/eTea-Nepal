const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://eteanepalbackend-production.up.railway.app"
      : "http://localhost:8000",
};

export default config;
