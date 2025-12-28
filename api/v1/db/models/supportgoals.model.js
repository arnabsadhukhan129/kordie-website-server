const mongoose = require('mongoose');

const supportGoalsSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: { type: String },
        link: { type: String },
        description: { type: String },
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const SupportGoalsModel = mongoose.model('supportgoals', supportGoalsSchema);
module.exports = SupportGoalsModel;
