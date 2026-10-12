const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    // Shared Person/Employee Identity for EMS Integration (File 3, Sec 18)
    employee_id: {
        type: String,
        required: [true, 'Employee/Person ID is required'],
        unique: true,
        trim: true
    },
    full_name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Security: Never return password by default
    },
    // Role-Based Access Control (File 3, Sec 14)
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'COURSE_ADMIN', 'TRAINER', 'LEARNER', 'ASSESSOR', 'FINANCE'],
        default: 'LEARNER'
    },
    // Strict IANA Timezone handling (File 3, Sec 8)
    timezone: {
        type: String,
        default: 'Asia/Karachi' // Store IANA string, conversions done on demand
    },
    phone: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: 'General'
    },
    designation: {
        type: String,
        default: 'Employee'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    // Security 2FA readiness (File 3, Sec 15)
    two_factor_enabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' } // UTC Standard
});

// Pre-save Middleware: Automatic Password Hashing using Argon2id
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        // Hashing using Argon2id algorithm as requested in technical specs
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id
        });
        next();
    } catch (err) {
        next(err);
    }
});

// Method to verify password on Login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (err) {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);