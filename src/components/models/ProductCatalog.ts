import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductCatalog {
  private items: IProduct[] = [];
  private previewItem: IProduct | null = null;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.items = [];
    this.previewItem = null;
    this.events = events;
  }

  public setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed', this.items);
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  public setPreviewItem(item: IProduct): void {
    this.previewItem = item;
    this.events.emit('product:selected', item);
  }

  public getPreviewItem(): IProduct | null {
    return this.previewItem;
  }
}
