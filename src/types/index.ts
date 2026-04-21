export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash';

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
    payment: TPayment; // обязательный способ оплаты (без null)
    total: number;
    items: string[]; // массив ID товаров
}

export interface IOrderResponse {
    id: string;
    total: number;
}
