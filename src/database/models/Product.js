import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['cfg', 'optimization'],
        required: true
    },
    subcategory: {
        type: String,
        enum: ['cfg-basic', 'optimization-with-bios', 'optimization-without-bios'],
        required: true
    },
    stock: {
        type: Number,
        default: 999
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Product', ProductSchema);
