import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

// Import icon từ lucide-react
import {
  Package,
  Layers,
  Tag,
  Truck,
  TruckIcon,
  RotateCcw,
} from "lucide-react";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Quản lý sản phẩm",
      icon: <Package size={40} color="#28a745" />, // success
      color: "success",
      path: "/products/list",
    },
    {
      title: "Quản lý danh mục",
      icon: <Layers size={40} color="#0dcaf0" />, // info
      color: "info",
      path: "/categories",
    },
    {
      title: "Quản lý thương hiệu",
      icon: <Tag size={40} color="#ffc107" />, // warning
      color: "warning",
      path: "/brands",
    },
    {
      title: "Nhập hàng",
      icon: <Truck size={40} color="#0d6efd" />, // primary
      color: "primary",
      path: "/import",
    },
    {
      title: "Xuất hàng",
      icon: <TruckIcon size={40} color="#dc3545" />, // danger
      color: "danger",
      path: "/export",
    },
    {
      title: "Danh sách trả hàng",
      icon: <RotateCcw size={40} color="#6c757d" />, // secondary
      color: "secondary",
      path: "/customer-return/list",
    },
  ];

  return (
    <Container fluid className="bg-light min-vh-100 py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Staff Dashboard</h2>
        <p className="text-muted">Chọn chức năng bạn muốn thực hiện</p>
      </div>

      {/* Các nút chức năng */}
      <Row className="g-4 justify-content-center">
        {actions.map((item, index) => (
          <Col key={index} xs={10} sm={6} md={4} lg={3}>
            <Card
              className="text-center shadow-sm border-0 h-100"
              style={{
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Card.Body>
                <div className="mb-3">{item.icon}</div>
                <Card.Title className="fw-semibold">{item.title}</Card.Title>
                <Button
                  variant={item.color}
                  className="mt-3 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.path);
                  }}
                >
                  Vào
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer */}
      <footer className="text-center mt-5 text-muted">
        <small>© 2025 Staff Control Panel | Designed by Mạnh ✨</small>
      </footer>
    </Container>
  );
};

export default StaffDashboard;
