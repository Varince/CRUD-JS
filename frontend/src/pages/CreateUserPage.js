import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/CreateUserPage.css';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const CreateUserPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/checkEmail?email=${email}`);
            return response.data.exists;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = { name: '', email: '', password: '' };

        const trimmedName = name.trim();

        if (!trimmedName) formErrors.name = 'Le nom est requis';
        else if (trimmedName.length < 3) formErrors.name = 'Le nom doit contenir au moins 3 caractères';
        else if (/\d/.test(trimmedName)) formErrors.name = 'Le nom ne doit pas contenir de chiffres';
        else if (/[^a-zA-Z\s]/.test(trimmedName)) formErrors.name = 'Le nom ne doit contenir que des lettres';
        else if (/\s{2,}/.test(trimmedName)) formErrors.name = 'Le nom ne doit pas contenir des espaces consécutifs';

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!email) formErrors.email = 'Le mail est requis';
        else if (!emailRegex.test(email)) formErrors.email = 'Veuillez entrer une adresse email valide';
        else {
            const emailExists = await checkEmailExists(email);
            if (emailExists) formErrors.email = 'Cet email est déjà utilisé';
        }

        if (!password) formErrors.password = 'Le mot de passe est requis';
        else if (password.length < 8) formErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        else if (!/[A-Z]/.test(password)) formErrors.password = 'Le mot de passe doit contenir au moins une majuscule';
        else if (!/[a-z]/.test(password)) formErrors.password = 'Le mot de passe doit contenir au moins une minuscule';
        else if (!/\d/.test(password)) formErrors.password = 'Le mot de passe doit contenir au moins un chiffre';

        setErrors(formErrors);

        if (Object.values(formErrors).some(error => error)) return;

        try {
            await axios.post('http://localhost:5000/api/users/register', { name, email, password, role });
            setSuccessMessage('Utilisateur créé avec succès!');
            setTimeout(() => {
                navigate('/admin');
            }, 1000);
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <div className="dashboardPage">
            <Sidebar />
            <div className="addUserContent">
                <h1>Ajouter utilisateur</h1>
                <form onSubmit={handleSubmit}>
                    <label>Nom:</label>
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    {errors.name && <p className="error">{errors.name}</p>}

                    <label>Email:</label>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}

                    <label>Mot de passe:</label>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input 
                            type={passwordVisible ? 'text' : 'password'} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <span 
                            className="password-toggle" 
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}

                    <label>Rôle:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>

                    <button type="submit">Créer l'utilisateur</button>
                </form>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </div>
        </div>
    );
};

export default CreateUserPage;
