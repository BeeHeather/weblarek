import { IApi, IOrderResponse, IOrder, IProduct } from "../../types";

export class StoreApi {
    constructor(private api: IApi) {
        this.api = api; 
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ total: number; items: IProduct[] }>('/product/');
        return response.items;
    }
    createOrder(data: IOrder): Promise<IOrderResponse> {
        return this.api.post('/order/', data);
    }
    }