export const getLastOrderId = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  const savedOrderId = localStorage.getItem('lastOrderId');
  if (savedOrderId) {
    const orderId = parseInt(savedOrderId);
    if (!isNaN(orderId)) {
      return orderId;
    }
  }
  return null;
};

export const saveOrderId = (orderId: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lastOrderId', orderId.toString());
};

export const clearOrderData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lastOrderId');
  localStorage.removeItem('basket');
};