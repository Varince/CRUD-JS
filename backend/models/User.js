const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }
    },
    role: { type: String, default: 'user' },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    console.log("Hashing Password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password:", this.password);

    next();
});

module.exports = mongoose.model('User', userSchema);