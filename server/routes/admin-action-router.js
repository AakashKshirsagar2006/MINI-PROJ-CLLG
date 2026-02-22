

// module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// MODELS 
const FoodItems = require('../model/food-item-model');
// Removed Order model - Admin router doesn't need it anymore!

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // Kept your 1MB limit!
});


router.use((req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) return res.status(401).json({ error: "Unauthenticated" });
    
    // BACK TO STRICT ADMIN ONLY. Staff cannot bypass this anymore.
    if (user.user_type !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    next();
});

const deleteFile = (filename) => {
    if (!filename) return;
    const filePath = path.join('uploads', filename);
    fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete file: ${filename}`, err.message);
    });
};

// ==================================================================
//  FOOD MANAGEMENT ROUTES (Strictly Admin)
// ==================================================================

// 1. ADD FOOD ITEM
router.post('/add-food-item', upload.single('image'), async (req, res) => {
    try {
        const { itemUID, tag, name, price, category, quantity,  dietaryType, highlights } = req.body;

        if (!req.file) return res.status(400).json({ error: "Image is required" });

        await new FoodItems({
            itemUID, tag, name, price, category, quantity, locked_quantity: 0,  dietaryType,
            highlights: highlights ? highlights.split(',') : [],
            img: req.file.filename,
            availability: true
        }).save();

        res.status(201).json({ message: "Item added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error!" });
    }
});

// 2. UPDATE FOOD ITEM
router.post('/update-food-item/:itemId', upload.single('image'), async (req, res) => {
    console.log("Update food item route hit");
    const itemId = req.params.itemId;
    const { tag, name, price, category, quantity,  dietaryType, highlights } = req.body;

    try {
        const oldItem = await FoodItems.findById(itemId);
        if (!oldItem) return res.status(404).json({ error: "Item not found" });
        
        let updateData = {
            tag, name, price, category, quantity,  dietaryType,
            highlights: highlights ? highlights.split(',') : []
        };
    console.log("Update data before image check:", updateData);
        console.log(req.file);
        if (req.file) {
            console.log("New image :", req.file.filename);
            deleteFile(oldItem.img); 
            updateData.img = req.file.filename;
        }
        await FoodItems.findByIdAndUpdate(itemId, { $set: updateData });

        res.status(200).json({ message: "Item updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error!" });
    }
});

// 3. DELETE FOOD ITEM
router.delete('/delete-food-item/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const item = await FoodItems.findById(itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });
        
        deleteFile(item.img);
        await FoodItems.findByIdAndDelete(itemId);

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error!" });
    }
});

// 4. STOCK MODIFICATION
router.post('/stock-modification', async (req, res) => {
    const { availability, quantity, itemId } = req.body;

    if (!itemId) return res.status(400).json({ error: "Bad Request" });

    try {
        if (availability === false) {
            await FoodItems.findByIdAndUpdate(itemId, { $set: { quantity: 0, availability: false } });
        } 
        else {
            const validQuantity = !isNaN(quantity) ? Number(quantity) : 0;
            await FoodItems.findByIdAndUpdate(itemId, { 
                $set: { quantity: Math.max(0, validQuantity), availability: true } 
            });
        }
        return res.status(200).json({ message: "Stock Modified" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error!" });
    }
});

module.exports = router;