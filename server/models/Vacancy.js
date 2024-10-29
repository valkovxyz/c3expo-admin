// server/models/Vacancy.js
import mongoose from 'mongoose'

const vacancySchema = new mongoose.Schema({
    content: {
        en: {
            title: { type: String, required: true },
            file: {
                url: String,
                pathname: String,
                contentType: String
            }
        },
        de: {
            title: { type: String, required: true },
            file: {
                url: String,
                pathname: String,
                contentType: String
            }
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// Обновляем updatedAt при каждом сохранении
vacancySchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

export const Vacancy = mongoose.models.Vacancy || mongoose.model('Vacancy', vacancySchema)