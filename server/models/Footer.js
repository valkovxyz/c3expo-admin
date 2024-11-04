import mongoose from 'mongoose'

const footerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        required: true,
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

footerSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

export const Footer = mongoose.models.Footer || mongoose.model('Footer', footerSchema)