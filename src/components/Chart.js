import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const fetchData = async (selectedYear) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/charts/import-export?year=${selectedYear}`
      );
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <h5 style={{ margin: 0 }}>Biểu đồ tổng nhập - xuất theo tháng</h5>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            padding: "5px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flexGrow: 1, width: "100%" }}>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20%" }}>
            Đang tải dữ liệu...
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="totalImport" name="Tổng nhập" fill="#8884d8" />
              <Bar dataKey="totalExport" name="Tổng xuất" fill="#ca8282ff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Chart;
