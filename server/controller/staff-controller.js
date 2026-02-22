const bcrypt = require('bcrypt');
const Staff = require('../model/staff-model');

// ==========================================
// GET ALL STAFF (For Admin Dashboard)
// ==========================================
const getAllStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ staffList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch staff" });
    }
};

// ==========================================
// ADD NEW STAFF (With Auto-ID EMP001)
// ==========================================
const addStaff = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required" });
        }

        // AUTO-ID GENERATOR LOGIC
        const lastStaff = await Staff.findOne().sort({ createdAt: -1 });
        let newStaffId = "EMP001"; 

        if (lastStaff && lastStaff.staffId) {
            // Extract the number part from "EMP012" -> Slice off the first 3 chars ("EMP")
            const lastNum = parseInt(lastStaff.staffId.slice(3));
            if (!isNaN(lastNum)) {
                // Increment and pad with zeros (e.g., 12 + 1 = 13 -> "EMP013")
                newStaffId = `EMP${String(lastNum + 1).padStart(3, '0')}`;
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new Staff({
            staffId: newStaffId,
            name,
            password: hashedPassword
        });

        await newStaff.save();
        res.status(201).json({ 
            message: "Staff added successfully", 
            staff: { staffId: newStaff.staffId, name: newStaff.name } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add staff" });
    }
};

// ==========================================
// UPDATE STAFF
// ==========================================
const updateStaff = async (req, res) => {
    try {
        const { staffId, name, password } = req.body;

        if (!staffId) return res.status(400).json({ message: "Staff ID is required" });

        const updateData = {};
        if (name) updateData.name = name;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedStaff = await Staff.findOneAndUpdate(
            { staffId: staffId },
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedStaff) return res.status(404).json({ message: "Staff member not found" });

        res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update staff" });
    }
};

// ==========================================
// DELETE STAFF
// ==========================================
const deleteStaff = async (req, res) => {
    try {
        const { staffId } = req.body;

        if (!staffId) return res.status(400).json({ message: "Staff ID is required" });

        const deletedStaff = await Staff.findOneAndDelete({ staffId: staffId });
        
        if (!deletedStaff) return res.status(404).json({ message: "Staff member not found" });

        res.status(200).json({ message: "Staff deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete staff" });
    }
};

module.exports = { getAllStaff, addStaff, updateStaff, deleteStaff };