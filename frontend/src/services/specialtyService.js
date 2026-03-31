import api from './api';

// Get all specialties
export const getAllSpecialties = () => api.get('/api/specialty');

// Get specialty by ID
export const getSpecialtyById = (id) => api.get(`/api/specialty/${id}`);

// Create new specialty (Admin only)
export const createSpecialty = (data) => api.post('/api/specialty', data);

// Update specialty (Admin only)
export const updateSpecialty = (id, data) => api.put(`/api/specialty/${id}`, data);

// Delete specialty (Admin only)
export const deleteSpecialty = (id) => api.delete(`/api/specialty/${id}`);
