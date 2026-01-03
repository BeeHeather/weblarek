import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IProduct } from "../../../types";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketCard extends Card<IProduct> {
  protected deleteItem: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.deleteItem = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    if (actions?.onClick) {
      this.deleteItem.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    const indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    indexElement.textContent = String(value);
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) {
      if (data.title !== undefined) {
        this.title = data.title;
      }
      if (data.price !== undefined) {
        this.price = data.price;
      }
    }
    return this.container;
  }
}
