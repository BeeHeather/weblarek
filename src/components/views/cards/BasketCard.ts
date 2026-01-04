import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IProduct } from "../../../types";

export type TBasketCard = Pick<IProduct, 'title' | 'price'> & { index: number };
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketCard extends Card<TBasketCard> {
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
}
