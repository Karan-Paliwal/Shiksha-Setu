import api from './api';

export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const saveProfile = async (formData: FormData) => {
  const response = await api.put('/profile/setup', formData);
  return response.data;
};

export const clearMarksheets = async () => {
  const response = await api.delete('/profile/marksheets');
  return response.data;
};
