import { IProduct } from '../../types/index';
import { EventEmitter, IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private readonly events: IEvents = new EventEmitter()) {
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('basket:item-added', { item, items: this.items });
        this.events.emit('basket:change', { items: this.items, total: this.getTotal(), count: this.getCount() });
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter(i => i.id !== item.id);
        this.events.emit('basket:item-removed', { item, items: this.items });
        this.events.emit('basket:change', { items: this.items, total: this.getTotal(), count: this.getCount() });
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:cleared');
        this.events.emit('basket:change', { items: this.items, total: this.getTotal(), count: this.getCount() });
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}