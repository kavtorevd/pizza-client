export const ROUTING = {
    login: {
        href: '/login',
        name: 'авторизация',
    },
    registration: {
        href: '/registration',
        name: 'регистрация',
    },
    home: {
        href: '/',
        name: 'домашняя страница',
    },
    basket: {
        href: '/basket',
        name: 'корзина',
    },
    select_location_page: {
        href: '/selectLocation',
        name: 'указать локацию',
    },
    select_location_map_page: {
        href: '/map',
        name: 'указать локацию на карте',
    },
    confirm_order: {
        href: '/confirm_order',
        name: 'подтвердить заказ',
    },
    pizza_info: {
        href: '/pizza',
        name: 'пицца',
    },
    // Обновляем track_order для поддержки параметров
    track_order: (orderId?: number) => ({
        href: orderId ? `/track_order?orderId=${orderId}` : '/track_order',
        name: 'статус заказа',
    }),
} as const;

// Типы для маршрутов
export type RouteKey = keyof typeof ROUTING;
export type RouteParams = {
    track_order: { orderId: number };
};

// Вспомогательная функция для получения маршрута с параметрами
export function getRoute<T extends RouteKey>(
    key: T,
    ...params: T extends keyof RouteParams ? [RouteParams[T]] : []
) {
    const route = ROUTING[key];
    
    if (typeof route === 'function') {
        if (key === 'track_order') {
            const orderId = params[0] as RouteParams['track_order'];
            return route(orderId.orderId);
        }
    }
    
    return route;
}