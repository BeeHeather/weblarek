import { Component } from "../../base/Component.ts";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils.ts";

export abstract class Card<T = IProduct> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this.cardPrice.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }
}
