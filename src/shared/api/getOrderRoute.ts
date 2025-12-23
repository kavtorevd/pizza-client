async function getOrderRoute(orderId: number) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/orders/orders/${orderId}/route-info/`,
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
    console.error('Ошибка получения маршрута:', e);
    throw e;
  }
}

export default getOrderRoute;