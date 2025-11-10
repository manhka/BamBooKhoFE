import React, { useState, useEffect } from 'react';
import styles from '../AddCustomerModal/AddCustomerModal.module.css'; 
import { updateCustomer } from '../../services/customerService';
import { X, Save, UserCheck, AlertCircle } from 'lucide-react';

function EditCustomerModal({ show, onClose, onCustomerUpdated, customerToEdit }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
 * @component EditCustomerModal
 * @description
 * Modal component để CẬP NHẬT thông tin khách hàng.
 */
  useEffect(() => {
    if (customerToEdit) {
      setCustomerName(customerToEdit.CustomerName || '');
      setPhone(customerToEdit.Phone || '');
      setAddress(customerToEdit.Address || '');
      setError(''); 
    } else {
      setCustomerName('');
      setPhone('');
      setAddress('');
    }
  }, [customerToEdit]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      setIsLoading(false);
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setError('Số điện thoại không hợp lệ');
      setIsLoading(false);
      return;
    }

    try {
      const customerData = {
        CustomerName: trimmedName,
        Phone: trimmedPhone,
        Address: trimmedAddress,
      };
      const result = await updateCustomer(customerToEdit.CustomerID, customerData);

      if (result.status === 'success') {
        onCustomerUpdated(result.data); 
        onClose(); 
      } else {
        setError(result.message || 'Cập nhật khách hàng thất bại.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi server, không thể cập nhật.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!customerToEdit) {
      return (
        <div className={styles.loadingContainer}>
          <span className={styles.spinner} role="status" aria-hidden="true"></span>
          Đang tải thông tin...
        </div>
      );
    }

    return (
      <form className={styles.modalBody} onSubmit={handleSubmit}>
        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} className={styles.errorIcon} />
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="editCustomerName" className={styles.formLabel}>
            Tên Khách Hàng <span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="text"
            className={styles.formInput}
            id="editCustomerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="editPhone" className={styles.formLabel}>
            Số Điện Thoại <span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="tel"
            className={styles.formInput}
            id="editPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="editAddress" className={styles.formLabel}>
            Địa Chỉ <span className={styles.requiredMark}>*</span>
          </label>
          <textarea
            className={styles.formInput}
            id="editAddress"
            rows="2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner} role="status" aria-hidden="true"></span>
            ) : (
              <Save size={16} className={styles.buttonIcon} />
            )}
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>
            <UserCheck size={20} className={styles.titleIcon} /> Sửa Thông Tin Khách Hàng
          </h4>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default EditCustomerModal;