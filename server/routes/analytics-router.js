const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../model/order-model');
const ArchivedOrder = require('../model/archived-order-model');
// FIXED: Importing the dedicated Staff model instead of User
const Staff = require('../model/staff-model'); 

router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        
        // Get the 1st day of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); 

        // 1. FAST COUNTS FOR INDIVIDUAL METRICS
        // Get currently pending orders from the hot collection
        const pendingOrdersCount = await Order.countDocuments({ fullfillment_status: "PENDING" });
        
        // FIXED: Count documents directly from the Staff collection
        const activeStaffCount = await Staff.countDocuments({});

        // 2. THE MASTER AGGREGATION PIPELINE
        // We query the Archive and Union with Active Orders for complete financial history
        const stats = await ArchivedOrder.aggregate([
            { 
                $unionWith: { 
                    coll: "orders", 
                    pipeline: [ { $match: { status: "PAID" } } ] 
                } 
            },
            { $match: { status: "PAID" } },
            {
                $facet: {
                    "lifetime": [
                        { 
                            $group: { 
                                _id: null, 
                                totalRevenue: { $sum: "$amount" }, 
                                totalOrders: { $count: {} }
                            } 
                        }
                    ],
                    "today": [
                        { $match: { paidAt: { $gte: startOfToday } } },
                        { 
                            $group: { 
                                _id: null, 
                                todayRevenue: { $sum: "$amount" }, 
                                todayOrders: { $count: {} } 
                            } 
                        }
                    ],
                    "revenueGraph": [
                        { 
                            $group: { 
                                _id: { 
                                    year: { $year: "$paidAt" }, 
                                    month: { $month: "$paidAt" } 
                                },
                                monthlyTotal: { $sum: "$amount" }
                            } 
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                        { $limit: 12 } 
                    ]
                }
            }
        ]);

        // 3. FORMAT THE EXTRACTED DATA
        const result = stats[0];
        const lifetimeData = result.lifetime[0] || { totalRevenue: 0, totalOrders: 0 };
        const todayData = result.today[0] || { todayRevenue: 0, todayOrders: 0 };

        // Format the graph data for the frontend chart
        const graphData = result.revenueGraph.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                monthLabel: date.toLocaleString('default', { month: 'short' }),
                revenue: item.monthlyTotal
            };
        });

        // 4. SEND CLEAN JSON TO FRONTEND
        res.status(200).json({
            metrics: {
                totalRevenue: lifetimeData.totalRevenue,
                totalOrders: lifetimeData.totalOrders,
                todayRevenue: todayData.todayRevenue,
                todayOrders: todayData.todayOrders,
                pendingOrders: pendingOrdersCount,
                activeStaff: activeStaffCount
            },
            graphData: graphData
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
});

module.exports = router;