const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async(req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (name.length < 3) {
        return res.status(400).json({ message: 'Le nom doit contenir au moins 3 caractères' });
    }

    if (/\d/.test(name)) {
        return res.status(400).json({ message: 'Le nom ne doit pas contenir de chiffres' });
    }

    if (/[^a-zA-Z\s]/.test(name)) {
        return res.status(400).json({ message: 'Le nom ne doit contenir que des lettres' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Veuillez entrer une adresse email valide' });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès', user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
    }
};

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const { name, email, role } = req.body;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json({ message: 'Utilisateur mis à jour avec succès', user: updatedUser });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

const deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkEmail = async(req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email requis" });
    }

    try {
        const userExists = await User.findOne({ email });
        res.json({ exists: !!userExists });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { checkEmail, createUser, getAllUsers, getUserById, updateUser, deleteUser };