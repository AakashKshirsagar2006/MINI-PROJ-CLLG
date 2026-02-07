const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Import BOTH collections
const Order = require('../model/order-model');
const ArchivedOrder = require('../model/archived-order-model');

// ROUTE: GET /admin/analytics/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(new Date().setDate(1)); // 1st of this month
        
        // WE QUERY THE 'ARCHIVE' (Cold Data) AND UNION IT WITH 'ACTIVE' (Hot Data)
        const stats = await ArchivedOrder.aggregate([
            // 1. "Glue" the Active Orders onto this list
            { 
                $unionWith: { 
                    coll: "orders", // MUST match your actual MongoDB collection name (usually lowercase 'orders')
                    pipeline: [ { $match: { status: "PAID" } } ] // Only bring in PAID active orders
                } 
            },
            // 2. Filter: Double check we only have Money (PAID orders) from both sides
            { $match: { status: "PAID" } },
            
            // 3. Run the Calculations (Same as before)
            {
                $facet: {
                    // Total Lifetime Stats
                    "lifetime": [
                        { 
                            $group: { 
                                _id: null, 
                                totalRevenue: { $sum: "$amount" }, 
                                totalOrders: { $count: {} },
                                firstOrderDate: { $min: "$createdAt" }
                            } 
                        }
                    ],
                    // Today's Stats
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
                    // This Month's Stats
                    "month": [
                        { $match: { paidAt: { $gte: startOfMonth } } },
                        { 
                            $group: { 
                                _id: null, 
                                monthRevenue: { $sum: "$amount" }, 
                                monthOrders: { $count: {} } 
                            } 
                        }
                    ],
                    // Bar Chart Data (Last 12 Months)
                    "revenueGraph": [
                        { 
                            $group: { 
                                _id: { 
                                    year: { $year: "$paidAt" }, 
                                    month: { $month: "$paidAt" } 
                                },
                                monthlyTotal: { $sum: "$amount" },
                                orderCount: { $count: {} }
                            } 
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                        { $limit: 12 } 
                    ]
                }
            }
        ]);

        // 4. Formatting the Data (Safety checks if DB is empty)
        const result = stats[0];
        const lifetimeData = result.lifetime[0] || { totalRevenue: 0, totalOrders: 0, firstOrderDate: new Date() };
        const todayData = result.today[0] || { todayRevenue: 0, todayOrders: 0 };
        const monthData = result.month[0] || { monthRevenue: 0, monthOrders: 0 };

        // Calculate Average Orders Per Day
        const daysOpen = Math.max(1, Math.ceil((new Date() - new Date(lifetimeData.firstOrderDate)) / (1000 * 60 * 60 * 24)));
        const avgOrdersPerDay = (lifetimeData.totalOrders / daysOpen).toFixed(1);

        // Format Graph Data for Frontend
        const graphData = result.revenueGraph.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                label: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                revenue: item.monthlyTotal,
                orders: item.orderCount
            };
        });

        res.status(200).json({
            cards: {
                todayRevenue: todayData.todayRevenue,
                todayOrders: todayData.todayOrders,
                monthRevenue: monthData.monthRevenue,
                totalRevenue: lifetimeData.totalRevenue,
                totalOrders: lifetimeData.totalOrders,
                avgOrdersPerDay: avgOrdersPerDay
            },
            graph: graphData
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
});

module.exports = router;