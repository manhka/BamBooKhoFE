import React, { useState, useEffect, useMemo } from 'react';
import { getProductsForLookup } from '../../services/productService'; 
import styles from './LookupBarcodeModal.module.css'; 
import { X, Search, AlertCircle, Box, Package } from 'lucide-react';


const LookupBarcodeModal = ({ show, onClose }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productKeyword, setProductKeyword] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            if (!show) return;

            setIsLoading(true);
            setError(null);
            
            try {
                const res = await getProductsForLookup(); 
                
                if (res.data && Array.isArray(res.data)) {
                    setProducts(res.data);
                } else {
                    setProducts([]);
                    setError("Không tìm thấy dữ liệu sản phẩm.");
                }
            } catch (err) {
                console.error("Lookup error:", err);
                const msg = err.message || "Không thể tải danh sách sản phẩm.";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        if (show) {
            fetchProducts();
        }
    }, [show]); 

    const filteredProducts = useMemo(() => {
        if (!productKeyword) return products;
        const keyword = productKeyword.toLowerCase();
        return products.filter(p =>
            p.ProductName.toLowerCase().includes(keyword) ||
            p.BarcodeProduct.toLowerCase().includes(keyword)
        );
    }, [products, productKeyword]);
    
    if (!show) {
        return null;
    }

    const renderProductTable = () => (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th style={{ width: '5%' }}>#</th> 
                        <th style={{ width: '25%' }}><Package size={14}/> Barcode Sản phẩm</th>
                        <th style={{ width: '35%' }}><Box size={14}/> Tên Sản phẩm</th> 
                        <th style={{ width: '20%' }}>Thương hiệu</th> 
                        <th style={{ width: '20%', textAlign: 'right' }}>Tồn kho</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr className={styles.centerRow}><td colSpan="4">
                            <span className={styles.spinner}></span> Đang tải sản phẩm...
                        </td></tr>
                    ) : error ? (
                         <tr className={styles.centerRow}><td colSpan="4"> 
                            <AlertCircle size={18} className={styles.iconFix}/> {error}
                        </td></tr>
                    ) : filteredProducts.length === 0 ? (
                        <tr className={styles.centerRow}><td colSpan="4">
                            Không tìm thấy sản phẩm nào khớp với từ khóa.
                        </td></tr>
                    ) : (
                        filteredProducts.map((p, index) => (
                            <tr key={p.BarcodeProduct}>
                                <td>{index + 1}</td>
                                <td className={styles.highlightCode}>{p.BarcodeProduct}</td>
                                <td>{p.ProductName}</td>
                                <td>{p.Brand?.BrandName || 'N/A'}</td>
                                <td className={styles.alignRight}>{p.NumberOfProduct.toLocaleString('vi-VN')}</td> 
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
                        <Search size={20} className={styles.iconFix}/> Tra cứu Barcode & Tồn kho
                    </h4>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Barcode hoặc Tên sản phẩm..."
                            className={styles.searchInput}
                            value={productKeyword}
                            onChange={(e) => setProductKeyword(e.target.value)}
                        />
                    </div>
                    
                    {renderProductTable()}
                    
                    <p className={styles.note}>
                        * Sử dụng Barcode (Mã) ở cột thứ hai để điền vào file Excel nhập hàng.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LookupBarcodeModal;