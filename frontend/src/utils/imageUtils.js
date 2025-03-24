import config from "../config";

export const getImageUrl = (imagePath) => {
  // If no image path is provided, return empty string
  if (!imagePath) return "";

  // If it's already a full URL, return it as is
  if (imagePath.startsWith("http")) return imagePath;

  // Check if the path already includes 'public/'
  if (imagePath.includes("public/")) {
    return `${config.API_URL}/${imagePath}`;
  }

  // Standard case - append the path to the API URL's public folder
  return `${config.API_URL}/public/${imagePath}`;
};
