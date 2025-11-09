import React, { useState, useEffect, useCallback, useMemo } from "react"; 
import { getImportHistory } from "../../services/importService";
import { getAllSuppliers } from "../../services/supplierService"; 
import { getAllUsers } from "../../services/userService";         
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

import { Filter, Calendar, User, Eye, Users } from 'lucide-react'; 
import styles from './ImportHistoryPage.module.css'; 

const fetchSuppliers = async () => { try { const res = await getAllSuppliers(); return Array.isArray(res.data) ? res.data : []; } catch { return []; } }; 
const fetchUsers = async () => { try { const res = await getAllUsers(); return Array.isArray(res.data) ? res.data : []; } catch { return []; } }; 

const formatDateToString = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
};

const ImportHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]); 
    const [users, setUsers] = useState([]);         
    const [filters, setFilters] = useState({
        fromDate: null,
        toDate: null,
        supplierId: "", 
        userId: "",     
        barcode: "",    
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const [sortOrder, setSortOrder] = useState('desc'); 
    const pageSize = 10;

    // Fetch Suppliers and Users
    useEffect(() => {
        const loadFilterData = async () => {
             try {
                const [supplierData, userData] = await Promise.all([ fetchSuppliers(), fetchUsers() ]); 
                setSuppliers(supplierData);
                setUsers(userData.filter(u => u.RoleID === 1 || u.RoleID === 2)); 
             } catch (err) { console.error("Error loading filter data:", err); }
        };
        loadFilterData();
    }, []);


    // Fetch Import History 
    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                fromDate: formatDateToString(filters.fromDate),
                toDate: formatDateToString(filters.toDate),
                supplierId: filters.supplierId, 
                userId: filters.userId,         
            };
            Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

            const result = await getImportHistory(params);
            setOrders(result.orders || []); 
            setCurrentPage(1);
        } catch (err) {
            console.error("Error fetching import history:", err);
            setError(err.message || "Không thể tải lịch sử nhập hàng.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [filters.fromDate, filters.toDate, filters.supplierId, filters.userId]); 

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFilterChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.value });
    };

    const handleDateChange = (date, fieldName) => {
        setFilters({ ...filters, [fieldName]: date });
    };

    const handleResetFilters = () => {
        setFilters({ fromDate: null, toDate: null, supplierId: "", userId: "", barcode: "" });
    }

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const sortedOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return [...orders].sort((a, b) => {
            const dateA = new Date(a.ImportDate);
            const dateB = new Date(b.ImportDate);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [orders, sortOrder]);


    const indexOfLastOrder = currentPage * pageSize;
    const indexOfFirstOrder = indexOfLastOrder - pageSize;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder); 
    const totalPages = Math.ceil(sortedOrders.length / pageSize); 
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Lịch Sử Nhập Hàng</h2>

            {/* Filter Section */}
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
                            />
                        </div>
                        
                        {/* Nhà Cung Cấp */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><Users size={14}/> Nhà Cung Cấp</label>
                            <select
                                className={styles.formInput}
                                name="supplierId" value={filters.supplierId}
                                onChange={handleFilterChange} 
                                disabled={suppliers.length === 0}
                            >
                                <option value="">Tất cả</option>
                                {suppliers.map((s) => ( 
                                    <option key={s.SupplierID} value={s.SupplierID}>{s.SupplierName}</option> 
                                ))}
                            </select>
                        </div>
                        
                        {/* Người Nhập */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}><User size={14}/> Người Nhập</label>
                            <select
                                className={styles.formInput}
                                name="userId" value={filters.userId}
                                onChange={handleFilterChange} 
                                disabled={users.length === 0}
                            >
                                <option value="">Tất cả</option>
                                {users.map((u) => ( 
                                    <option key={u.UserID} value={u.UserID}>{u.Username}</option> 
                                ))}
                            </select>
                        </div>
                        
                        {/* Xóa Mã Sản Phẩm */}

                        <div className={styles.filterActions}>
                             {/* Nút Đặt Lại */}
                            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleResetFilters}>Đặt lại</button>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className={styles.alert}>{error}</div>}

            {/* Thanh Sắp xếp */}
            <div className={styles.toolbar}>
                <div className={styles.sortContainer}>
                    <label htmlFor="sortOrderSelect" className={styles.sortLabel}>Sắp xếp:</label>
                    <select id="sortOrderSelect" value={sortOrder} onChange={handleSortChange} className={styles.sortSelect}>
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </div>
            </div>


            {/* Table Section */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Ngày Nhập</th>
                            <th>Nhà Cung Cấp</th>
                            <th>Người Nhập</th>
                            <th>Sản Phẩm (SL * Đơn giá)</th>
                            <th>Tổng Tiền</th>
                            {/* ĐÃ XÓA: Cột Chi tiết */}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Cập nhật colSpan = 5 (6 cột - 1 cột bị xóa)
                            <tr><td colSpan="5" className={styles.loadingRow}>
                                <span className={styles.spinner} role="status"></span> Đang tải...
                            </td></tr>
                        ) : currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <tr key={order.ImportID}>
                                    <td data-label="Ngày Nhập">{new Date(order.ImportDate).toLocaleDateString('vi-VN')}</td>
                                    <td data-label="Nhà Cung Cấp">{order.Supplier?.SupplierName || 'N/A'}</td>
                                    <td data-label="Người Nhập">{order.User?.Username || 'N/A'}</td>
                                    <td data-label="Sản Phẩm">
                                        {order.ImportDetails?.map(d => (
                                            <div key={d.ImportDetailID} className={styles.productDetailItem}>
                                                {d.Product?.ProductName || d.BarcodeProduct} ({d.Quantity} * {d.UnitPrice?.toLocaleString('vi-VN')}₫)
                                            </div>
                                        ))}
                                        {(!order.ImportDetails || order.ImportDetails.length === 0) && 'Không có chi tiết'}
                                    </td>
                                    <td data-label="Tổng Tiền">{order.Total?.toLocaleString('vi-VN')}₫</td>
                                    {/* ĐÃ XÓA: Nút Xem Chi tiết */}
                                </tr>
                            ))
                        ) : (
                            // Cập nhật colSpan = 5
                            <tr><td colSpan="5" className={styles.emptyRow}>Không tìm thấy đơn nhập hàng nào.</td></tr>
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
                                <button className={styles.pageLink} onClick={() => paginate(number + 1)}>
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

export default ImportHistoryPage;