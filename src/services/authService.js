import axiosClient from "../api/axiosClient";

export const login = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};
