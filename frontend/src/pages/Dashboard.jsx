import React, { useEffect, useState } from "react";
import StatisticsCard from "../components/StatisticsCard";
import WarehouseChart from "../components/WarehouseChart";
import api from "../utils/axios";
import { FaWarehouse, FaBoxes, FaTags } from "react-icons/fa";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalWarehouses: 0,
        totalProducts: 0,
        totalCategories: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [warehouses, products, categories] = await Promise.all([
                    api.get("/warehouses"),
                    api.get("/products"),
                    api.get("/categories"),
                ]);

                setStats({
                    totalWarehouses: warehouses.data.length,
                    totalProducts: products.data.length,
                    totalCategories: categories.data.length,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <StatisticsCard
                        title="Total Warehouses"
                        value={stats.totalWarehouses}
                        icon={<FaWarehouse size={40} />}
                    />
                </div>
                <div className="col-md-4">
                    <StatisticsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<FaBoxes size={40} />}
                    />
                </div>
                <div className="col-md-4">
                    <StatisticsCard
                        title="Total Categories"
                        value={stats.totalCategories}
                        icon={<FaTags size={40} />}
                    />
                </div>
            </div>
            <div className="mt-5">
                <WarehouseChart />
            </div>
        </div>
    );
};

export default Dashboard;