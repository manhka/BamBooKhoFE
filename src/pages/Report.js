import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { Search, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import {
  getQuarterReport,
  exportQuarterReport,
} from "../services/reportService";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const Report = () => {
  const [quarter, setQuarter] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const { callApi } = useApiWithErrorRedirect();

  const handleFetch = async () => {
    try {
      const rows = await callApi(getQuarterReport, { quarter, year });
      setData(rows);
    } catch (err) {
      alert(err.message || "Lỗi khi lấy dữ liệu báo cáo!");
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
    try {
      await callApi(exportQuarterReport, { quarter, year });
    } catch (err) {
      alert(err.message || "Không thể xuất file Excel!");
    }
  };

  // Tính tổng tiền
  const totalAmount = (data || []).reduce((sum, row) => {
    const value = parseFloat(row.Total?.replace(/\D/g, "")) || 0;
    return sum + value;
  }, 0);

  // Format tiền
  const formatCurrency = (value) =>
    value != null ? value.toLocaleString("vi-VN") + "₫" : "";

  return (
    <Container className="mt-5">
      <h4 className="mb-3 text-center">Báo cáo nhập - xuất hàng</h4>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
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
          <Form.Control
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
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
            <th>Thời gian</th>
            <th>Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Đơn Giá</th>
            <th>Thành Tiền</th>
            <th>Đối Tác</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data?.map((row, idx) => (
              <tr key={idx}>
                <td>{row.Type}</td>
                <td>{row.Date}</td>
                <td>{row.Product}</td>
                <td>{row.Quantity}</td>
                <td>{row.UnitPrice}</td>
                <td>{row.Total}</td>
                <td>{row.Partner}</td>
              </tr>
            ))
          )}
        </tbody>
        {data?.length > 0 && (
          <tfoot>
            <tr className="table-success fw-bold">
              <td colSpan={5} className="text-end">
                Tổng cộng:
              </td>
              <td>{formatCurrency(totalAmount)}</td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </Table>
    </Container>
  );
};

export default Report;
