import { Component } from "../../base/Component.ts";
import { ensureElement } from "../../../utils/utils.ts";

export interface ICard {
  title: string;
  price: number | null;
}

export abstract class Card<T = ICard> extends Component<T> {
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
