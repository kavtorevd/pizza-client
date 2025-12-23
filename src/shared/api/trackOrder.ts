import { IPizza } from '../interfaces';

export interface IOrderItem {
  pizza: IPizza;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: number;
  customer_phone: string;
  delivery_address: string;
  delivery_coordinates: string;
  total_cost: string;
  status: 'pending' | 'accepted' | 'preparing' | 'assigned' | 'on_way' | 'delivered' | 'cancelled';
  status_display: string;
  estimated_delivery_time: number;
  created_at: string;
  updated_at: string;
  driver?: number;
  driver_name?: string;
  branch?: number;
  branch_address?: string;
  user_name?: string;
}

export interface IRoute {
  distance: number;
  duration: number;
  duration_minutes: number;
  coordinates: [number, number][];
  raw_coordinates: [number, number][];
  error?: string;
}

export interface ICourier {
  id: number;
  name: string;
  phone_number: string;
  coordinates: string;
  status: 'free' | 'busy' | 'offline';
}

export interface IBranch {
  id: number;
  number: string;
  address: string;
  coordinates: string;
}

export interface IOrderTracking {
  order: IOrder;
  route: IRoute | null;
  items: IOrderItem[];
  courier: ICourier | null;
  branch: IBranch | null;
}

export interface ITrackOrderResponse {
  data: IOrderTracking | null;
  error?: string;
}

export class OrderTrackingService {
  private static BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  static async getOrderTracking(orderId: number): Promise<ITrackOrderResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/orders/${orderId}/tracking-info/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      return { 
        data: null,
        error: error instanceof Error ? error.message : 'Не удалось загрузить данные заказа'
      };
    }
  }

  static async updateCourierLocation(driverId: number, coordinates: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}/update_location/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating courier location:', error);
      return false;
    }
  }

  static formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Ожидает подтверждения',
      'accepted': 'Принят',
      'preparing': 'Готовится',
      'assigned': 'Назначен водителю',
      'on_way': 'В пути',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен',
    };
    return statusMap[status] || status;
  }

  static getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'pending': '#FFA500',
      'accepted': '#FFA500',
      'preparing': '#FFA500',
      'assigned': '#2196F3',
      'on_way': '#2196F3',
      'delivered': '#4CAF50',
      'cancelled': '#F44336',
    };
    return colorMap[status] || '#666';
  }

  static getStatusProgress(status: string): number {
    const progressMap: Record<string, number> = {
      'pending': 10,
      'accepted': 20,
      'preparing': 40,
      'assigned': 60,
      'on_way': 80,
      'delivered': 100,
      'cancelled': 0,
    };
    return progressMap[status] || 0;
  }

  static getStatusSteps(): string[] {
    return ['Ожидает подтверждения', 'Принят', 'Готовится', 'Назначен водителю', 'В пути', 'Доставлен'];
  }

  static getStatusIndex(status: string): number {
    const statusOrder = ['pending', 'accepted', 'preparing', 'assigned', 'on_way', 'delivered'];
    return statusOrder.indexOf(status);
  }

  static parseCoordinates(coordinates: string): [number, number] {
    const [lat, lng] = coordinates.split(',').map(Number);
    return [lat, lng];
  }

  static formatPrice(price: string | number): number {
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return price;
  }
}