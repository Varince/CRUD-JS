import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async(userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: error.message };
    }
};

export const getUsers = async() => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: error.message };
    }
};

export const deleteUser = async(id) => {
    try {
        await api.delete(`/${id}`);
        return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        throw error.response ? error.response.data : { message: error.message };
    }
};