const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('items');
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('items');
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new restaurant
router.post('/', async (req, res) => {
    const restaurant = new Restaurant(req.body);
    try {
        const savedRestaurant = await restaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
