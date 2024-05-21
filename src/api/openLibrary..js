import axios from "axios";

const BASE_URL = "https://openlibrary.org";

export const fetchBooks = async (
  query = "the+lord+of+the+rings",
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search.json?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from OpenLibrary API", error);
    return { docs: [], numFound: 0 };
  }
};
