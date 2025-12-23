// 'use client'
// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import Link from 'next/link';
// import { ROUTING } from '@/shared/routing';
// import Arrow from '@@/icons/Arrow.svg';
// import Card from '@/shared/Card';
// import Loading from '@/shared/Loading';
// import { IPizza } from '@/shared/interfaces';
// import styles from './styles.module.scss';

// // Динамический импорт Leaflet (чтобы избежать SSR проблем)
// const MapContainer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Popup = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Popup),
//   { ssr: false }
// );

// // Импортируем CSS Leaflet
// import 'leaflet/dist/leaflet.css';

// // Исправляем проблему с иконками маркеров в Leaflet
// import L from 'leaflet';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon.src,
//   shadowUrl: iconShadow.src,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// // Типы для статусов заказа
// type OrderStatus = 'Готовится' | 'Приготовлен' | 'Курьер в пути' | 'Доставлено';

// // Интерфейс для данных курьера
// interface ICourier {
//   id: number;
//   name: string;
//   phone: string;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   estimatedTime: string; // Формат: "15-20 мин"
// }

// export default function TrackOrderPage() {
//   const [orderStatus, setOrderStatus] = useState<OrderStatus>('Готовится');
//   const [orderDetails, setOrderDetails] = useState<IPizza[]>([]);
//   const [courier, setCourier] = useState<ICourier | null>(null);
//   const [deliveryAddress, setDeliveryAddress] = useState<string>('');
//   const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [mapCenter, setMapCenter] = useState<[number, number]>([55.7558, 37.6173]);
//   const [isMapReady, setIsMapReady] = useState(false);

//   // Функция для симуляции движения курьера
//   const simulateCourierMovement = () => {
//     if (!courier) return;

//     const interval = setInterval(() => {
//       if (orderStatus === 'Курьер в пути') {
//         setCourier(prev => {
//           if (!prev) return prev;

//           // Небольшое случайное изменение координат для имитации движения
//           const newLat = prev.coordinates.lat + (Math.random() - 0.5) * 0.001;
//           const newLng = prev.coordinates.lng + (Math.random() - 0.5) * 0.001;

//           // Обновляем центр карты
//           setMapCenter([newLat, newLng]);

//           return {
//             ...prev,
//             coordinates: {
//               lat: newLat,
//               lng: newLng
//             }
//           };
//         });
//       }
//     }, 3000); // Обновляем каждые 3 секунды

//     return () => clearInterval(interval);
//   };

//   // Функция для симуляции обновления статуса
//   const simulateStatusUpdates = () => {
//     const statuses: OrderStatus[] = ['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'];
//     let currentIndex = 0;

//     const interval = setInterval(() => {
//       if (currentIndex < statuses.length - 1) {
//         currentIndex++;
//         const newStatus = statuses[currentIndex];
//         setOrderStatus(newStatus);

//         // При переходе в статус "Курьер в пути" запускаем движение
//         if (newStatus === 'Курьер в пути' && courier) {
//           setCourier({
//             ...courier,
//             coordinates: {
//               lat: 55.7522,
//               lng: 37.6156,
//             },
//             estimatedTime: '15-20 мин'
//           });
//           setMapCenter([55.7522, 37.6156]);
//         }

//         // Обновляем время доставки в зависимости от статуса
//         if (newStatus === 'Готовится') {
//           setEstimatedDelivery('Примерное время доставки: 40-50 минут');
//         } else if (newStatus === 'Приготовлен') {
//           setEstimatedDelivery('Примерное время доставки: 30-40 минут');
//         } else if (newStatus === 'Курьер в пути') {
//           setEstimatedDelivery('Примерное время доставки: 15-20 минут');
//         } else {
//           setEstimatedDelivery('Заказ доставлен!');
//         }
//       } else {
//         clearInterval(interval);
//       }
//     }, 15000); // Меняем статус каждые 15 секунд

//     return () => clearInterval(interval);
//   };

//   useEffect(() => {
//     // Загрузка данных заказа из localStorage
//     const loadOrderData = () => {
//       setLoading(true);

//       try {
//         // Загружаем детали заказа
//         const savedBasket = localStorage.getItem('basket');
//         if (savedBasket) {
//           const parsedBasket: IPizza[] = JSON.parse(savedBasket);
//           setOrderDetails(parsedBasket);

//           // Рассчитываем общую сумму
//           const total = parsedBasket.reduce((sum, item) => {
//             return sum + (item.cost * (item.amount || 1));
//           }, 0);
//           setTotalAmount(total);
//         }

//         // Загружаем адрес доставки
//         const savedLocation = localStorage.getItem('selectedLocation');
//         if (savedLocation) {
//           const location = JSON.parse(savedLocation);
//           setDeliveryAddress(location.address);
//           // Можно использовать адрес для геокодирования, но для простоты используем Москву
//         }

//         // Примерные данные курьера
//         const mockCourier: ICourier = {
//           id: 123,
//           name: 'Иван Петров',
//           phone: '+7 (999) 123-45-67',
//           coordinates: {
//             lat: 55.7558,
//             lng: 37.6173,
//           },
//           estimatedTime: '25-30 мин'
//         };

//         setCourier(mockCourier);
//         setEstimatedDelivery('Примерное время доставки: 40-50 минут');
//         setIsMapReady(true);

//         // Стартуем симуляцию обновления статуса
//         const statusCleanup = simulateStatusUpdates();

//         setLoading(false);

//         return () => {
//           statusCleanup();
//         };
//       } catch (error) {
//         console.error('Ошибка загрузки данных:', error);
//         setLoading(false);
//       }
//     };

//     const cleanup = loadOrderData();
//     return cleanup;
//   }, []);

//   useEffect(() => {
//     // Запускаем движение курьера при изменении статуса
//     if (orderStatus === 'Курьер в пути') {
//       const movementCleanup = simulateCourierMovement();
//       return movementCleanup;
//     }
//   }, [orderStatus, courier]);

//   // Функция для получения цвета статуса
//   const getStatusColor = (status: OrderStatus) => {
//     switch (status) {
//       case 'Готовится': return '#FFA500';
//       case 'Приготовлен': return '#4CAF50';
//       case 'Курьер в пути': return '#2196F3';
//       case 'Доставлено': return '#8BC34A';
//       default: return '#666';
//     }
//   };

//   // Функция для отображения карты с OpenStreetMap
//   const renderMap = () => {
//     if (!isMapReady || !courier) {
//       return (
//         <div className={styles.mapPlaceholder}>
//           <Loading />
//           <p>Загружаем карту...</p>
//         </div>
//       );
//     }

//     return (
//       <div className={styles.mapContainer}>
//         <MapContainer
//           center={mapCenter}
//           zoom={15}
//           className={styles.map}
//           scrollWheelZoom={false}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={[courier.coordinates.lat, courier.coordinates.lng]}>
//             <Popup>
//               <div className={styles.popupContent}>
//                 <strong>Курьер</strong>
//                 <p>{courier.name}</p>
//                 <p>Телефон: {courier.phone}</p>
//                 <p>Время доставки: {courier.estimatedTime}</p>
//               </div>
//             </Popup>
//           </Marker>
//         </MapContainer>

//         <div className={styles.courierInfo}>
//           <div className={styles.courierInfoItem}>
//             <span className={styles.courierLabel}>Курьер:</span>
//             <span className={styles.courierName}>{courier.name}</span>
//           </div>
//           <div className={styles.courierInfoItem}>
//             <span className={styles.courierLabel}>Телефон:</span>
//             <span className={styles.courierPhone}>{courier.phone}</span>
//           </div>
//           <div className={styles.courierInfoItem}>
//             <span className={styles.courierLabel}>Доставит через:</span>
//             <span className={styles.courierTime}>{courier.estimatedTime}</span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loading}>
//           <Loading />
//           <p>Загружаем информацию о заказе...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {/* Заголовок и кнопка назад */}
//       <div className={styles.header}>
//         <Link className={styles.arrow} href={ROUTING.home.href}>
//           <Arrow />
//         </Link>
//         <h2 className={styles.title}>Местоположение курьера</h2>
//       </div>

//       {/* Карта с курьером */}
//       {renderMap()}

//       {/* Статус заказа */}
//       <div className={styles.statusSection}>
//         <h3 className={styles.sectionTitle}>Статус заказа</h3>
//         <div 
//           className={styles.statusBadge}
//           style={{ backgroundColor: getStatusColor(orderStatus) }}
//         >
//           {orderStatus}
//         </div>

//         {/* Прогресс бар */}
//         <div className={styles.progressBar}>
//           <div className={styles.progressSteps}>
//             {['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].map((status, index) => (
//               <div key={status} className={styles.progressStep}>
//                 <div 
//                   className={`${styles.stepDot} ${
//                     index <= ['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].indexOf(orderStatus) 
//                       ? styles.active 
//                       : ''
//                   }`}
//                   style={index <= ['Готовится', 'Приготовлен', 'Курьер в пути', 'Доставлено'].indexOf(orderStatus) 
//                     ? { backgroundColor: getStatusColor(status as OrderStatus) } 
//                     : {}}
//                 />
//                 <span className={styles.stepLabel}>{status}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Адрес доставки */}
//       {deliveryAddress && (
//         <div className={styles.deliveryAddress}>
//           <h3 className={styles.sectionTitle}>Адрес доставки</h3>
//           <p className={styles.addressText}>{deliveryAddress}</p>
//         </div>
//       )}

//       {/* Предполагаемое время доставки */}
//       {estimatedDelivery && (
//         <div className={styles.deliveryTime}>
//           <h3 className={styles.sectionTitle}>Время доставки</h3>
//           <p className={styles.timeText}>{estimatedDelivery}</p>
//         </div>
//       )}

//       {/* Детали заказа */}
//       <div className={styles.orderDetails}>
//         <h3 className={styles.sectionTitle}>Детали заказа</h3>

//         <div className={styles.orderSummary}>
//           <div className={styles.summaryRow}>
//             <span>Общая сумма:</span>
//             <span className={styles.totalValue}>{totalAmount} ₽</span>
//           </div>
//         </div>

//         {orderDetails.length > 0 ? (
//           <ul className={styles.orderItems}>
//             {orderDetails.map((pizza: IPizza) => (
//               <li key={pizza.id} className={styles.orderItem}>
//                 <Card 
//                   name={pizza.name} 
//                   image={pizza.image}
//                   cost={pizza.cost} 
//                   sale={pizza.amount} 
//                   currency='₽' 
//                 />
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className={styles.emptyOrder}>Нет информации о заказе</p>
//         )}
//       </div>
//     </div>
//   );
// }

'use client'
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс для иконок Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
  });
}

interface CourierMapProps {
  routeCoordinates: [number, number][];
  restaurantPosition: [number, number];
  deliveryPosition: [number, number];
  courierPosition: [number, number];
  courierName: string;
  courierPhone: string;
}

// Кастомная иконка для курьера
const createCourierIcon = () => {
  return L.divIcon({
    className: 'courier-icon',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: #2196F3;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        🛵
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Иконка для ресторана
const createRestaurantIcon = () => {
  return L.divIcon({
    className: 'restaurant-icon',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #4CAF50;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        🍕
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Иконка для точки доставки
const createDeliveryIcon = () => {
  return L.divIcon({
    className: 'delivery-icon',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #FF5722;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
      ">
        🏠
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function CourierMap({
  routeCoordinates,
  restaurantPosition,
  deliveryPosition,
  courierPosition,
  courierName,
  courierPhone
}: CourierMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [routeLayer, setRouteLayer] = useState<L.Polyline | null>(null);
  const [courierMarker, setCourierMarker] = useState<L.Marker | null>(null);
  const [restaurantMarker, setRestaurantMarker] = useState<L.Marker | null>(null);
  const [deliveryMarker, setDeliveryMarker] = useState<L.Marker | null>(null);

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Создаем карту с центром в середине маршрута
    const centerLat = (restaurantPosition[0] + deliveryPosition[0]) / 2;
    const centerLng = (restaurantPosition[1] + deliveryPosition[1]) / 2;

    const leafletMap = L.map(mapRef.current).setView([centerLat, centerLng], 13);

    // Добавляем тайлы OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, [restaurantPosition, deliveryPosition, map]);

  // Отрисовка маршрута
  // Если вы хотите исправить существующий компонент, замените useEffect для маршрута:
  useEffect(() => {
    if (!map || route.length < 2) return; // Добавьте проверку на существование map

    // Удаляем старый маршрут
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Создаем новый маршрут
    const newRouteLayer = L.polyline(route, {
      color: '#2196F3',
      weight: 4,
      opacity: 0.7,
      lineJoin: 'round',
    }).addTo(map);

    setRouteLayer(newRouteLayer);
  }, [map, route]); // Добавьте map в зависимости

  // Добавление маркеров
  useEffect(() => {
    if (!map) return;

    // Удаляем старые маркеры
    if (restaurantMarker) map.removeLayer(restaurantMarker);
    if (deliveryMarker) map.removeLayer(deliveryMarker);
    if (courierMarker) map.removeLayer(courierMarker);

    // Маркер ресторана
    const restaurant = L.marker(restaurantPosition, {
      icon: createRestaurantIcon(),
    }).addTo(map);

    restaurant.bindPopup(`
      <div style="padding: 10px;">
        <strong style="font-size: 14px;">🍕 Пиццерия</strong><br>
        <span style="font-size: 12px;">Точка отправления</span>
      </div>
    `);

    // Маркер точки доставки
    const delivery = L.marker(deliveryPosition, {
      icon: createDeliveryIcon(),
    }).addTo(map);

    delivery.bindPopup(`
      <div style="padding: 10px;">
        <strong style="font-size: 14px;">🏠 Доставка</strong><br>
        <span style="font-size: 12px;">Адрес доставки</span>
      </div>
    `);

    // Маркер курьера
    const courier = L.marker(courierPosition, {
      icon: createCourierIcon(),
    }).addTo(map);

    courier.bindPopup(`
      <div style="padding: 10px;">
        <strong style="font-size: 14px;">Курьер</strong><br>
        <span style="font-size: 12px;">${courierName}</span><br>
        <span style="font-size: 12px;">Тел: ${courierPhone}</span>
      </div>
    `);

    setRestaurantMarker(restaurant);
    setDeliveryMarker(delivery);
    setCourierMarker(courier);

    // Анимация пульсации для маркера курьера
    const pulseInterval = setInterval(() => {
      const icon = courier.getElement();
      if (icon) {
        icon.style.transform = icon.style.transform === 'scale(1.1)'
          ? 'scale(1)'
          : 'scale(1.1)';
        icon.style.transition = 'transform 0.5s ease';
      }
    }, 1000);

    return () => {
      clearInterval(pulseInterval);
    };
  }, [map, courierPosition, restaurantPosition, deliveryPosition, courierName, courierPhone]);

  // Обновление позиции курьера
  useEffect(() => {
    if (!courierMarker) return;

    courierMarker.setLatLng(courierPosition);

    // Обновляем попап
    const popup = courierMarker.getPopup();
    if (popup) {
      courierMarker.bindPopup(`
        <div style="padding: 10px;">
          <strong style="font-size: 14px;">Курьер</strong><br>
          <span style="font-size: 12px;">${courierName}</span><br>
          <span style="font-size: 12px;">Тел: ${courierPhone}</span>
        </div>
      `);
    }
  }, [courierMarker, courierPosition, courierName, courierPhone]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '400px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}
    />
  );
}