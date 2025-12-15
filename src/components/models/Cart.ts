import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];
  constructor() {
    this.items = [];
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
  }

  public removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
  }

  public clear(): void {
    this.items = [];
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
