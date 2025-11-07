import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; 
import { saveAs } from "file-saver"; 
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { Search, FileDown, Upload } from "lucide-react";

const Report = () => {
  const [quarter, setQuarter] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  const handleFetch = async () => {
    if (!quarter || !year) return alert("Chọn quý và năm!");
    try {
      const res = await axios.get("http://localhost:3001/api/report/quarter", {
        params: { quarter, year },
      });

      const allRows = [];

      res.data.imports?.forEach((imp) => {
        imp.ImportDetails.forEach((d) => {
          allRows.push({
            Type: "Nhập hàng",
            Date: imp.ImportDate, 
            Product: d.Product.ProductName,
            Quantity: d.Quantity,
            UnitPrice: d.UnitPrice,
            Total: d.Total,
            Partner: imp.Supplier?.SupplierName,
          });
        });
      });

      res.data.exports?.forEach((exp) => {
        exp.ExportDetails.forEach((d) => {
          allRows.push({
            Type: "Xuất hàng",
            Date: exp.ExportDate, 
            Product: d.Product.ProductName,
            Quantity: d.Quantity,
            UnitPrice: d.UnitPrice,
            Total: d.Total,
            Partner: exp.Customer?.CustomerName,
          });
        });
      });
      setData(allRows);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lấy dữ liệu!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "", range: 1 });
      
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleExportExcel = async () => {
    if (!quarter || !year) return alert("Vui lòng chọn quý và năm để xuất!");
    
    try {
      const res = await axios.get("http://localhost:3001/api/report/export-quarter", {
        params: { quarter, year },
        responseType: "blob", 
      });
      saveAs(res.data, `BaoCao_Q${quarter}_${year}.xlsx`);
    } catch (err) {
      console.error("Lỗi khi xuất Excel:", err);
      alert("Không thể xuất file Excel!");
    }
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-3 text-center">Báo cáo nhập - xuất hàng</h4>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            <option value="">-- Chọn quý --</option>
            <option value="1">Quý 1 (1-3)</option>
            <option value="2">Quý 2 (4-6)</option>
            <option value="3">Quý 3 (7-9)</option>
            <option value="4">Quý 4 (10-12)</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Control
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Năm"
          />
        </Col>

        <Col md="auto">
          <Button variant="primary" onClick={handleFetch}>
            <Search size={16} className="me-1" />
            Xem theo quý
          </Button>
        </Col>

        <Col md="auto">
          <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </Col>

        <Col md="auto">
          <Button variant="success" onClick={handleExportExcel}>
            <FileDown size={16} className="me-1" />
            Xuất Excel
          </Button>
        </Col>
      </Row>

      <Table bordered striped hover responsive>
        <thead className="table-primary">
          <tr>
            <th>Loại</th>
            <th>Ngày</th>
            <th>Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Đơn Giá</th>
            <th>Thành Tiền</th>
            <th>Đối Tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">Không có dữ liệu</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Report;