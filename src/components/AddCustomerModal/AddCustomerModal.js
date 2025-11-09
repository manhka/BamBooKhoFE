import React, { useState } from 'react';
import styles from './AddCustomerModal.module.css';
import { createCustomer } from '../../services/customerService';
import { X, Save, UserPlus, AlertCircle } from 'lucide-react';

/**
 * @component AddCustomerModal
 * @description
 * Modal component để thêm mới khách hàng
 */
function AddCustomerModal({ show, onClose, onCustomerCreated }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show) {
    return null;
  }

  /**
   * Xử lý đóng modal.
   * Reset toàn bộ state về giá trị mặc định trước khi gọi callback onClose.
   */
  const handleClose = () => {
    setCustomerName('');
    setPhone('');
    setAddress('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName) {
      setError('Yêu cầu nhập tên khách hàng.');
      setIsLoading(false);
      return;
    }

    if (!trimmedAddress) {
      setError('Yêu cầu nhập đầy đủ địa chỉ khách hàng.');
      setIsLoading(false);
      return;
    }

    if (!trimmedPhone) {
      setError('Yêu cầu nhập số điện thoại.');
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setError('Số điện thoại không hợp lệ.');
      setIsLoading(false);
      return;
    }

    try {
      const customerData = {
        CustomerName: trimmedName,
        Phone: trimmedPhone,
        Address: trimmedAddress,
      };

      const result = await createCustomer(customerData);

      if (result.status === 'success') {
        onCustomerCreated(result.data);
        handleClose();
      } else {
        setError(result.message || 'Thêm khách hàng không thành công.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi server, không thể thêm khách hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>
            <UserPlus size={20} className={styles.titleIcon} /> Thêm Khách Hàng Mới
          </h4>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} className={styles.errorIcon} />
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="customerNameModal" className={styles.formLabel}>
              Tên Khách Hàng <span className={styles.requiredMark}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              id="customerNameModal"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneModal" className={styles.formLabel}>
              Số Điện Thoại <span className={styles.requiredMark}>*</span>
            </label>
            <input
              type="tel"
              className={styles.formInput}
              id="phoneModal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="addressModal" className={styles.formLabel}>
              Địa Chỉ <span className={styles.requiredMark}>*</span>
            </label>
            <textarea
              className={styles.formInput}
              id="addressModal"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Yêu cầu ghi chi tiết địa chỉ khách hàng"
            ></textarea>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleClose}
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
                <span
                  className={styles.spinner}
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <Save size={16} className={styles.buttonIcon} />
              )}
              Lưu Khách Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomerModal;