import React, { useEffect, useState } from "react";
import { Table, Badge, Spinner, Pagination } from "react-bootstrap";
import { getCustomerReturnOrders } from "../services/customerReturnService";
import { useApiWithErrorRedirect } from "../hooks/useApiWithErrorRedirect";

const CustomerReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const { callApi } = useApiWithErrorRedirect();

  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true); // bật loading
      try {
        const res = await callApi(() => getCustomerReturnOrders());
        setReturns(res.data);
      } catch (err) {
        console.error(err);
        // Có thể set alert nếu muốn thông báo lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  // Phân trang
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentReturns = returns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(returns.length / rowsPerPage);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Danh sách đơn trả hàng</h3>
      <Table
        bordered
        hover
        responsive
        className="shadow-sm text-center align-middle"
      >
        <thead className="table-light">
          <tr>
            <th>STT</th>
            <th>Barcode</th>
            <th>Sản phẩm</th>
            <th>Số lượng trả</th>
            <th>Lý do</th>
            <th>Ngày trả</th>
            <th>Khách hàng</th>
            <th>Nhân viên xử lý</th>
          </tr>
        </thead>
        <tbody>
          {currentReturns && currentReturns.length > 0 ? (
            currentReturns.map((order, orderIndex) =>
              order.CustomerReturnDetails.map((detail, detailIndex) => (
                <tr key={detail.CustomerReturnDetailID}>
                  {detailIndex === 0 && (
                    <td rowSpan={order.CustomerReturnDetails.length}>
                      {(currentPage - 1) * rowsPerPage + orderIndex + 1}
                    </td>
                  )}
                  <td>{detail.BarcodeProduct}</td>
                  <td>{detail.Product.ProductName}</td>
                  <td>{detail.Quantity}</td>
                  <td>
                    <Badge bg="warning" text="dark">
                      {detail.Reason}
                    </Badge>
                  </td>
                  {detailIndex === 0 && (
                    <td rowSpan={order.CustomerReturnDetails.length}>
                      {new Date(order.ReturnDate).toLocaleDateString()}
                    </td>
                  )}
                  {detailIndex === 0 && (
                    <td rowSpan={order.CustomerReturnDetails.length}>
                      {order.ExportOrder.Customer.CustomerName}
                    </td>
                  )}
                  {detailIndex === 0 && (
                    <td rowSpan={order.CustomerReturnDetails.length}>
                      {order.User.Username}
                    </td>
                  )}
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-3">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default CustomerReturnList;
