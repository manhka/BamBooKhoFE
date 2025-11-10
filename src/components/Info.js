"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Boxes,
  AlertTriangle,
  DollarSign,
  BarChart3,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  numberLowProductWarning,
  getMonthlyRevenue,
  getNumberProduct,
} from "../services/productService";

export default function Info() {
  const navigate = useNavigate();
  // --- Fetch danh sách sản phẩm sắp hết hàng ---
  const [lowStockProducts, setlowStockProducts] = useState(0);
  const [monthlyRevenueTotal, setmonthlyRevenueTotal] = useState(0);
  const [totalProducts, settotalProducts] = useState(0);

  useEffect(() => {
    const fetchNumberOfLowProductWarningData = async () => {
      try {
        const numberRes = await numberLowProductWarning();
        setlowStockProducts(numberRes || 0);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchNumberOfLowProductWarningData();
  }, []);
  useEffect(() => {
    const fetchMonthlyRevenueTotalData = async () => {
      try {
        const monthlyRevenueTotalRes = await getMonthlyRevenue();
        setmonthlyRevenueTotal(monthlyRevenueTotalRes || 0);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchMonthlyRevenueTotalData();
  }, []);
  useEffect(() => {
    const fetchNumberOfProductData = async () => {
      try {
        const numberRes = await getNumberProduct();
        settotalProducts(numberRes || 0);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchNumberOfProductData();
  }, []);
  const card = (bg) => ({
    background: bg,
    color: "white",
    borderRadius: "16px",
    border: 0,
  });

  const title = { fontSize: "13px", opacity: 0.85, fontWeight: 500 };
  const value = { fontSize: "28px", fontWeight: 700 };

  return (
    <div className="h-100 d-flex flex-column">
      <h5 className="fw-semibold text-secondary mb-4">Tổng quan kho hàng</h5>

      <div className="row g-3 flex-grow-1">
        <div className="col-6 col-md-3">
          <div className="p-3 h-100 shadow-sm" style={card("#0ea5e9")}>
            <div style={title}>Tổng sản phẩm</div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <Boxes size={22} opacity={0.9} />
              <span style={value}>{totalProducts}</span>
            </div>
            <button
              className="btn btn-link p-0 text-white small mt-2"
              style={{ opacity: 0.85 }}
              onClick={() => navigate("/products/list")}
            >
              Xem danh sách
            </button>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 h-100 shadow-sm" style={card("#dc2626")}>
            <div style={title}>Sản phẩm sắp hết</div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <AlertTriangle size={22} opacity={0.9} />
              <span style={value}>{lowStockProducts}</span>
            </div>
            <button
              className="btn btn-link p-0 text-white small mt-2"
              style={{ opacity: 0.85 }}
              onClick={() => navigate("/products/stock/list-warning")}
            >
              Xem danh sách
            </button>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 h-100 shadow-sm" style={card("#f59e0b")}>
            <div style={title}>Doanh thu tháng này</div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <BarChart3 size={22} opacity={0.9} />
              <span style={value}>
                {Number(monthlyRevenueTotal).toLocaleString("vi-VN")} VNĐ{" "}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* quick action bottom left */}
      <div className="mt-4 d-flex gap-2">
        <button
          className="btn d-flex align-items-center gap-1 px-3"
          style={{
            background: "#0ea5e9",
            color: "white",
            borderRadius: "10px",
          }}
          onClick={() => navigate("/warehouse/import")}
        >
          <ArrowDownCircle size={16} /> Nhập hàng
        </button>

        <button
          className="btn d-flex align-items-center gap-1 px-3"
          style={{
            background: "#6366f1",
            color: "white",
            borderRadius: "10px",
          }}
          onClick={() => navigate("/warehouse/export")}
        >
          <ArrowUpCircle size={16} /> Xuất hàng
        </button>
      </div>
    </div>
  );
}
