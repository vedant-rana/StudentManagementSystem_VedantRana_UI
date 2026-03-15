import axiosClient from "../api/axiosClient";

export const getClasses = async () => {
  const response = await axiosClient.get("/classes");
  return response.data;
};
