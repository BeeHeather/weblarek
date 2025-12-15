import { IProduct } from "../../types";

export class ProductCatalog {
  private items: IProduct[] = [];
  private previewItem: IProduct | null = null;
  constructor() {
    this.items = [];
    this.previewItem = null;
  }

  public setItems(items: IProduct[]): void {
    this.items = items;
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  public setPreviewItem(item: IProduct): void {
    this.previewItem = item;
  }

  public getPreviewItem(): IProduct | null {
    return this.previewItem;
  }
}
