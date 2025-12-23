import { IOrder } from "../interfaces";

async function getOrderInfo(orderId: number): Promise<IOrder> {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/orders/orders/${orderId}/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    ).then((res) => {
      if (res.ok) return res.json();
      else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
    });
    return response;
  } catch(e) {
    console.error('Ошибка получения информации о заказе:', e);
    throw e;
  }
}

export default getOrderInfo;