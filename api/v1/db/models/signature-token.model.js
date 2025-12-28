const mongoose = require('mongoose');

const tokenPayloadSchema = new mongoose.Schema({
    userAgent: {
        type: String,
        required: false,
        default: '',
    },
    date: {
        type: Date,
        required: true,
    },
    device: {
        type: String,
        enum: ['A', 'I', 'ATV', 'ITV', 'W'],
        default: 'W'
    },
    uid: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    }
}, {
    timestamps: false,
    _id: false
});

const signatureTokenSchema = new mongoose.Schema({
    session_id: {
        type: String,
        unique: true,
        required: true
    },
    expiry_time: {
        type: Date,
        required: true
    },
    creation_time: {
        type: Date,
        required: true
    },
    signature: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    token_payload: {
        type: tokenPayloadSchema,
        required: true,
    }
});

const SignatureTokenModel = mongoose.model('signature_token', signatureTokenSchema);

module.exports = SignatureTokenModel;
