import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWarrantyProductById,
  createCustomerReturn,
} from "../services/customerReturnService";
import { Button, Card, Form, Alert } from "react-bootstrap";

const CustomerReturn = () => {
  const { exportDetailId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("warning");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getWarrantyProductById(exportDetailId);
        setProduct(res.data);
        setQuantity(res.data.RemainingQuantity); // default max
      } catch (err) {
        console.error(err);
        setAlertMessage("Không thể tải thông tin sản phẩm.");
        setAlertVariant("danger");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [exportDetailId]);

  const handleReturn = async () => {
    if (!quantity || quantity <= 0) {
      setAlertMessage("Vui lòng nhập số lượng trả hợp lệ.");
      return;
    }
    if (quantity > product.RemainingQuantity) {
      setAlertMessage(
        `Số lượng trả không được vượt quá ${product.RemainingQuantity}`
      );
      return;
    }
    if (!product.WarrantyStatus) {
      setAlertMessage("Sản phẩm đã hết bảo hành, không thể trả.");
      return;
    }
    if (!reason.trim()) {
      setAlertMessage("Vui lòng nhập lý do trả sản phẩm.");
      return;
    }

    try {
      await createCustomerReturn({
        ReturnDate: new Date(),
        UserID: 1, // ví dụ user hiện tại
        ExportID: product.ExportID,
        BarcodeProduct: product.BarcodeProduct,
        Quantity: quantity,
        Reason: reason,
      });
      setAlertMessage("Trả hàng thành công!");
      setTimeout(() => navigate(-1), 1500); // quay về trang trước
    } catch (err) {
      console.error(err);
      setAlertMessage("Lỗi server, không thể trả hàng.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const isDisabled =
    quantity <= 0 ||
    quantity > product.RemainingQuantity ||
    !product.WarrantyStatus ||
    !reason.trim();

  return (
    <div className="container" style={{ marginTop: 80, marginBottom: 40 }}>
      {alertMessage && (
        <Alert
          variant={alertVariant}
          onClose={() => setAlertMessage("")}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Card>
        <Card.Header as="h5">Trả sản phẩm</Card.Header>
        <Card.Body>
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <th>Tên sản phẩm</th>
                <td>{product.ProductName}</td>
              </tr>
              <tr>
                <th>Barcode</th>
                <td>{product.BarcodeProduct}</td>
              </tr>
              <tr>
                <th>Số lượng</th>
                <td>{product.Quantity}</td>
              </tr>
              <tr>
                <th>Đã trả</th>
                <td>{product.ReturnedQuantity || 0}</td>
              </tr>
              <tr>
                <th>Còn lại</th>
                <td>{product.RemainingQuantity}</td>
              </tr>
              <tr>
                <th>Bắt đầu bảo hành</th>
                <td>
                  {new Date(product.WarrantyStartTime).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <th>Kết thúc bảo hành</th>
                <td>
                  {new Date(product.WarrantyEndTime).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <th>Trạng thái bảo hành</th>
                <td>
                  {product.WarrantyStatus ? (
                    <span className="text-success">Còn bảo hành</span>
                  ) : (
                    <span className="text-danger">Hết bảo hành</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <Form>
            <Form.Group className="mb-3" controlId="returnQuantity">
              <Form.Label>Số lượng trả</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                min={1}
                max={product.RemainingQuantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={
                  !product.WarrantyStatus || product.RemainingQuantity === 0
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="returnReason">
              <Form.Label>Lý do trả</Form.Label>
              <Form.Control
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
              />
            </Form.Group>

            <Button
              variant={isDisabled ? "secondary" : "danger"}
              onClick={handleReturn}
              disabled={isDisabled}
            >
              Xác nhận trả hàng
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerReturn;
