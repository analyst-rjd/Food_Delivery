const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sustainabilityMetrics: { type: Object },
    categories: { type: [String] },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
