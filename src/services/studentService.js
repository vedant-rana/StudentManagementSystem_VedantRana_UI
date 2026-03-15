import axiosClient from "../api/axiosClient";

export const getStudents = async (params) => {
  const response = await axiosClient.get("/students", { params });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axiosClient.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (data) => {
  const response = await axiosClient.post("/students", data);
  return response.data;
};

export const updateStudent = async (id, data) => {
  const response = await axiosClient.put(`/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axiosClient.delete(`/students/${id}`);
  return response.data;
};
