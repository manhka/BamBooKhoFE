import React, { useState, useMemo } from 'react';
import styles from './LookupSupplierModal.module.css'; 
import { X, Search, Users, Tag, AlertCircle } from 'lucide-react';


const LookupSupplierModal = ({ show, onClose, suppliers }) => {
    const [keyword, setKeyword] = useState('');
    const filteredSuppliers = useMemo(() => {
        if (!keyword) {
            return suppliers;
        }
        const lowerKeyword = keyword.toLowerCase();

        return suppliers.filter(s =>
            // Lọc theo Label (Tên + ID) hoặc Phone
            s.label.toLowerCase().includes(lowerKeyword) ||
            s.data.Phone.includes(keyword)
        );
    }, [suppliers, keyword]);

    if (!show) {
        return null;
    }

    const renderSupplierTable = () => (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th style={{width: '15%'}}><Tag size={14}/> Mã NCC (SupplierID)</th>
                        <th style={{width: '35%'}}><Users size={14}/> Tên Nhà Cung Cấp</th>
                        <th style={{width: '25%'}}>SĐT</th>
                        <th style={{width: '25%'}}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.length === 0 && keyword ? (
                        <tr className={styles.centerRow}><td colSpan={4}>
                            <AlertCircle size={14}/> Không tìm thấy nhà cung cấp nào khớp với từ khóa.
                        </td></tr>
                    ) : (filteredSuppliers.length === 0 && !keyword) ? (
                        <tr className={styles.centerRow}><td colSpan={4}>
                            Chưa có dữ liệu nhà cung cấp hoặc đang tải.
                        </td></tr>
                    ) : (
                        filteredSuppliers.map(s => (
                            <tr key={s.value}>
                                <td className={styles.highlightCode}>{s.value}</td>
                                <td>{s.data.SupplierName}</td>
                                <td>{s.data.Phone || 'N/A'}</td>
                                <td>{s.data.Email || 'N/A'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h4 className={styles.modalTitle}>
                        <Users size={20} className={styles.iconFix}/> Tra cứu Mã Nhà Cung Cấp (ID)
                    </h4>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên, ID hoặc SĐT nhà cung cấp..."
                            className={styles.searchInput}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    
                    {renderSupplierTable()}
                    
                    <p className={styles.note}>
                        * Sử dụng Mã NCC (SupplierID) ở cột đầu tiên để điền vào file Excel nhập hàng.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LookupSupplierModal;