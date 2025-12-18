async function submitOrder(orderData: any) {
  const response = await fetch(
    `http://127.0.0.1:8000/orders/orders/`,
    {
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
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