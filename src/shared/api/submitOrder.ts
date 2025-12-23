async function submitOrder(orderData: any) {
  const response = await fetch(
    `http://127.0.0.1:8000/orders/orders/`,
    {
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 5a4fd672a7f4bcbe5537dc745db4fb827918d12a',
      },
      method: 'POST',
    }
  ).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
  });
  
  return response;
}

export default submitOrder;