import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import '../styles/EditUserPage.css';

const EditUserPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${id}`);
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
            } catch (error) {
                setError("Erreur lors de la récupération des données de l'utilisateur.");
            }
        };
        fetchUserData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ name: '', email: '' });
        setError('');
        setSuccessMessage('');

        let formErrors = { name: '', email: '' };
        const trimmedName = name.trim();

        if (!trimmedName) formErrors.name = 'Le nom est requis.';
        else if (trimmedName.length < 3) formErrors.name = 'Le nom doit contenir au moins 3 caractères.';
        else if (/\d/.test(trimmedName)) formErrors.name = 'Le nom ne doit pas contenir de chiffres.';
        else if (/[^a-zA-Z\s]/.test(trimmedName)) formErrors.name = 'Le nom ne doit contenir que des lettres ( pas de caractère spécial et accent  ).';
        else if (/\s{2,}/.test(trimmedName)) formErrors.name = 'Le nom ne doit pas contenir d\'espaces consécutifs.';

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) formErrors.email = 'Veuillez entrer une adresse email valide.';

        if (formErrors.name || formErrors.email) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${id}`,
                { name: trimmedName, email, role }
            );

            if (response.data) {
                setSuccessMessage('Utilisateur modifié avec succès !');
                setTimeout(() => navigate('/admin'), 1000);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError("Cet email est déjà utilisé par un autre utilisateur.");
                } else {
                    setError("Une erreur est survenue lors de la mise à jour.");
                }
            } else {
                setError("Erreur de connexion au serveur.");
            }
        }
    };

    return (
        <div className="dashboardPage">
            <Sidebar />
            <div className="updateUserContent">
                <h1>Modifier l'utilisateur</h1>
                <form onSubmit={handleSubmit}>
                    <div className="editUserInputContainer">
                        <label>Nom:</label>
                        <div className="editUserInputWithIcon">
                            <FaUser className="editUserInputIcon" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        {errors.name && <p className="editUserError">{errors.name}</p>}
                    </div>
                    <div className="editUserInputContainer">
                        <label>Email:</label>
                        <div className="editUserInputWithIcon">
                            <FaEnvelope className="editUserInputIcon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && <p className="editUserError">{errors.email}</p>}
                    </div>
                    <div className="editUserInputContainer">
                        <label>Rôle:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                    {error && <p className="editUserError">{error}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Sauvegarder</button>
                </form>
            </div>
        </div>
    );
};

export default EditUserPage;
