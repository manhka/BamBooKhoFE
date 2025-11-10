// pages/ExportHistoryPage/ExportHistoryPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getExportHistory } from '../../services/exportService';
import { getAllCustomers } from '../../services/customerService';
import { getAllUsers } from '../../services/userService';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Filter, Calendar, User, Eye, Users } from 'lucide-react';
import styles from './ExportHistoryPage.module.css';

const fetchCustomers = async () => { try { const res = await getAllCustomers(); return Array.isArray(res.data) ? res.data : []; } catch { return []; } };
const fetchUsers = async () => { try { const res = await getAllUsers(); return Array.isArray(res.data) ? res.data : []; } catch { return []; } };

const formatDateToString = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
};

const ExportHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ fromDate: null, toDate: null, customerId: "", userId: "" });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const [sortOrder, setSortOrder] = useState('desc'); 
    const pageSize = 10;

    // Fetch Customers and Users
    useEffect(() => {
        const loadFilterData = async () => {
             try {
                const [customerData, userData] = await Promise.all([ fetchCustomers(), fetchUsers() ]);
                setCustomers(customerData);
                setUsers(userData.filter(u => u.RoleID === 1 || u.RoleID === 2)); 
             } catch (err) { console.error("Error loading filter data:", err); }
        };
        loadFilterData();
    }, []);

    // Fetch Export History
    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                ...filters,
                fromDate: formatDateToString(filters.fromDate),
                toDate: formatDateToString(filters.toDate),
            };
            Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

            const result = await getExportHistory(params);
            setOrders(result.orders || []);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || "Không thể tải lịch sử xuất hàng.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFilterChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
    const handleDateChange = (date, fieldName) => setFilters({ ...filters, [fieldName]: date });
    const handleResetFilters = () => setFilters({ fromDate: null, toDate: null, customerId: "", userId: "" });
   
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Sắp xếp danh sách 'orders' trước khi phân trang
    const sortedOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return [...orders].sort((a, b) => {
            const dateA = new Date(a.ExportDate);
            const dateB = new Date(b.ExportDate);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [orders, sortOrder]);

    // Pagination Logic
    const indexOfLastOrder = currentPage * pageSize;
    const indexOfFirstOrder = indexOfLastOrder - pageSize;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder); 
    const totalPages = Math.ceil(sortedOrders.length / pageSize); 
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Lịch Sử Xuất Hàng</h2>
            
            <div className={styles.card}>
                <div className={styles.cardHeader}><Filter size={16} className={styles.iconFix}/> Bộ Lọc</div>
                <div className={styles.cardBody}>
                    <div className={styles.filterGrid}>
                        {/* Từ Ngày */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><Calendar size={14}/> Từ Ngày</label>
                            <DatePicker
                                selected={filters.fromDate}
                                onChange={(date) => handleDateChange(date, 'fromDate')}
                                selectsStart startDate={filters.fromDate} endDate={filters.toDate}
                                dateFormat="dd/MM/yyyy" 
                                className={styles.formInput}
                                wrapperClassName={styles.datePickerWrapper}
                                placeholderText="Chọn ngày bắt đầu"
                                isClearable
                            />
                        </div>
                        {/* Đến Ngày */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><Calendar size={14}/> Đến Ngày</label>
                            <DatePicker
                                selected={filters.toDate}
                                onChange={(date) => handleDateChange(date, 'toDate')}
                                selectsEnd startDate={filters.fromDate} endDate={filters.toDate} minDate={filters.fromDate}
                                dateFormat="dd/MM/yyyy" 
                                className={styles.formInput}
                                wrapperClassName={styles.datePickerWrapper}
                                placeholderText="Chọn ngày kết thúc"
                                isClearable
                            />
                        </div>
                        {/* Khách Hàng */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><Users size={14}/> Khách Hàng</label>
                            <select
                                className={styles.formInput}
                                name="customerId" value={filters.customerId}
                                onChange={handleFilterChange} disabled={customers.length === 0}
                            >
                                <option value="">Tất cả</option>
                                {customers.map((c) => (
                                <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>
                                ))}
                            </select>
                        </div>
                        {/* Người Xuất */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><User size={14}/> Người Xuất</label>
                            <select
                                className={styles.formInput}
                                name="userId" value={filters.userId}
                                onChange={handleFilterChange} disabled={users.length === 0}
                            >
                                <option value="">Tất cả</option>
                                {users.map((u) => (
                                <option key={u.UserID} value={u.UserID}>{u.Username}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className={styles.filterActions}>
                            <button 
                                className={`${styles.button} ${styles.buttonSecondary}`} 
                                onClick={handleResetFilters}
                            >
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className={styles.alert}>{error}</div>}

            <div className={styles.toolbar}>
                <div className={styles.sortContainer}>
                    <label htmlFor="sortOrderSelect" className={styles.sortLabel}>Sắp xếp:</label>
                    <select id="sortOrderSelect" value={sortOrder} onChange={handleSortChange} className={styles.sortSelect}>
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </div>
            </div>

            {/* Bảng */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Ngày Xuất</th>
                            <th>Khách Hàng</th> 
                            <th>Người Xuất</th>
                            <th>Sản Phẩm (SL * Đơn giá / BH)</th>
                            <th>Tổng Tiền</th> 
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="6" className={styles.loadingRow}>
                                <span className={styles.spinner} role="status"></span> Đang tải...
                             </td></tr>
                        ) : currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <tr key={order.ExportID}>
                                    <td data-label="Ngày Xuất">{new Date(order.ExportDate).toLocaleDateString('vi-VN')}</td>
                                    <td data-label="Khách Hàng">{order.Customer?.CustomerName || 'N/A'}</td>
                                    <td data-label="Người Xuất">{order.User?.Username || 'N/A'}</td>
                                    <td data-label="Sản Phẩm">
                                        {order.ExportDetails?.map(d => (
                                            <div key={d.ExportDetailID} className={styles.productDetailItem}>
                                            {d.Product?.ProductName || d.BarcodeProduct} ({d.Quantity} * {d.UnitPrice?.toLocaleString('vi-VN')}₫)
                                            {d.WarrantyTime !== null && d.WarrantyTime > 0 && <span className={styles.badge}>{d.WarrantyTime} tháng BH</span>}
                                            </div>
                                        ))}
                                         {(!order.ExportDetails || order.ExportDetails.length === 0) && 'Không có chi tiết'}
                                    </td>
                                    <td data-label="Tổng Tiền">{order.Total?.toLocaleString('vi-VN')}₫</td>
                                    <td data-label="Chi tiết">
                                        <Link to={`/export-detail/${order.ExportID}`} className={`${styles.button} ${styles.buttonOutline}`}>
                                            <Eye size={14}/> Xem
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr><td colSpan="6" className={styles.emptyRow}>Không tìm thấy đơn xuất hàng nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

             {/* Pagination Controls */}
             {Array.isArray(orders) && orders.length > pageSize && (
                  <nav aria-label="Page navigation" className={styles.paginationContainer}>
                      <ul className={styles.pagination}>
                          <li className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}>
                              <button className={styles.pageLink} onClick={() => paginate(currentPage - 1)}>Trước</button>
                          </li>
                          {[...Array(totalPages).keys()].map(number => (
                              <li key={number + 1} className={`${styles.pageItem} ${currentPage === number + 1 ? styles.active : ''}`}>
                                  <button onClick={() => paginate(number + 1)} className={styles.pageLink}>
                                      {number + 1}
                                  </button>
                              </li>
                          ))}
                          <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}>
                              <button className={styles.pageLink} onClick={() => paginate(currentPage + 1)}>Sau</button>
                          </li>
                      </ul>
                  </nav>
             )}
        </div>
    );
};

export default ExportHistoryPage;