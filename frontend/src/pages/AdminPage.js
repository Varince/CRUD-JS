import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../api';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import '../styles/AdminPage.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true); 
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                const filteredUsers = response.data.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                setError('Une erreur s\'est produite.');
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/users/${id}`);

                if (response.status === 200) {
                    setUsers(users.filter(user => user._id !== id));
                }
            } catch (error) {
                setError('Erreur lors de la suppression de l\'utilisateur.');
            }
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!isAdmin || loading) {
        return 
    }

    return (
        <div className="dashboardPage">
            <Sidebar />
            <div className="dashboardContent">
                <h2>LISTE UTILISATEUR</h2>
                <Link to="/admin/create">
                    <button className="addUserButton">Ajouter un utilisateur</button>
                </Link>
                {users.length === 0 ? (
                    <div className="messageContainer">Il n'y a actuellement aucun utilisateur à afficher.</div>
                ) : (
                    <table className="userTable">
                        <thead>
                            <tr>
                                <th>NOM</th>
                                <th>EMAIL</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="actionButtons">
                                            <button className="editButton" onClick={() => navigate(`/admin/edit/${user._id}`)}>
                                                <FaEdit />
                                            </button>
                                            <button className="deleteButton" onClick={() => handleDelete(user._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
