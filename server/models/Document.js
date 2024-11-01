// server/models/Document.js
import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
    content: {
        en: {
            title: { type: String, required: true, maxlength: 200 },
            file: {
                url: { type: String, maxlength: 1000 },
                pathname: { type: String, maxlength: 500 },
                contentType: { type: String, maxlength: 100 }
            }
        },
        de: {
            title: { type: String, required: true, maxlength: 200 },
            file: {
                url: { type: String, maxlength: 1000 },
                pathname: { type: String, maxlength: 500 },
                contentType: { type: String, maxlength: 100 }
            }
        }
    },
    order: {
        type: Number,
        default: 0,
        index: true // Add index for better query performance
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
    minimize: false, // Store empty objects
    validateBeforeSave: true // Ensure validation runs before saving
})

// Add compound index for common queries
documentSchema.index({ order: 1, createdAt: -1 })

// Add schema validations
documentSchema.pre('save', function(next) {
    // Ensure order is non-negative
    if (this.order < 0) this.order = 0

    next()
})

// Optimize queries by defining which fields are commonly used together
documentSchema.pre('find', function() {
    this.lean() // Always return plain objects instead of Mongoose documents
})

// Method to efficiently get the next order number
documentSchema.statics.getNextOrder = async function() {
    const highest = await this.findOne()
        .sort({ order: -1 })
        .select('order')
        .lean()
    return (highest?.order || 0) + 1
}

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema)