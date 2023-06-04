import { ClothItem } from './clothItemInterface';

export interface CartState {
    orderItems: CartItem[];
};

export interface CartItem {
    product: ClothItem;
    qty: number;
}

export class CartStateImpl implements CartState {
    orderItems: CartItem[];

    constructor() {
        this.orderItems = [];
    }
}
