
// async function submitOrder(orderData: any) {
//   const response = await fetch(
//     `http://127.0.0.1:8000/orders/orders/`,
//     {
//       body: JSON.stringify(orderData),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//     }
//   ).then((res) => {
//     if (res.ok) return res.json();
//     else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
//   });
  
//   return response;
// }

// export default submitOrder;

export interface ISubmitOrderResponse {
  id: number;
  customer_phone: string;
  delivery_address: string;
  delivery_coordinates: string;
  total_cost: string;
  status: string;
  estimated_delivery_time: number;
  created_at: string;
  driver?: number;
  branch?: number;
  items?: Array<{
    pizza: number;
    quantity: number;
    price: string;
  }>;
}

export interface ISubmitOrderData {
  customer_phone: string;
  delivery_address: string;
  delivery_coordinates?: string;
  items: Array<{
    pizza: number;
    quantity: number;
  }>;
  user?: number;
  status?: string;
}

export default async function submitOrder(orderData: ISubmitOrderData): Promise<ISubmitOrderResponse> {
  // Убери /api из пути
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const API_URL = API_BASE; // Не добавляем /api
  
  try {
    console.log('🎯 Отправляем запрос на:', `${API_URL}/orders/`);
    console.log('📦 Данные заказа:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch(`${API_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📥 Статус ответа:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Текст ответа:', responseText);
    
    if (!response.ok) {
      let errorDetail = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorDetail = errorData.detail || errorData.error || JSON.stringify(errorData, null, 2);
      } catch {
        // Оставляем как текст
      }
      
      throw new Error(`Ошибка сервера (${response.status}): ${errorDetail}`);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Заказ успешно создан:', data);
    
    return data;
    
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    throw error;
  }
}