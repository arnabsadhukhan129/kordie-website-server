const mongoose = require('mongoose')
const topicfocusedSchema = mongoose.Schema({
    logo: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});


// Middleware to enforce only one record in the collection
topicfocusedSchema.pre('save', async function (next) {
    if (this.isNew) { 
        const recordCount = await mongoose.model('hospitalitylogo').countDocuments();
        if (recordCount >= 7) {
            return next(new Error('Maximum of 7 records allowed. Please delete an existing record before adding a new one.'));
        }
    }
    next();
});


module.exports = mongoose.model('hospitalitylogo', topicfocusedSchema);


