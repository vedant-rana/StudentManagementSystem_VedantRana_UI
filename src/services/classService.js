import axiosClient from "../api/axiosClient";

export const getClasses = async () => {
  const response = await axiosClient.get("/classes");
  return response.data;
};

export const importClasses = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post("/classes/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
