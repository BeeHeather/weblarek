import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.items = [];
    this.events = events;
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:changed');
  }

  public removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
    this.events.emit('basket:changed');
  }

  public clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  public getTotalCost(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  public getTotalCount(): number {
    return this.items.length;
  }

  public isItemInCart(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
