import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils.ts";
import { categoryMap } from "../../../utils/constants.ts";

export type TCatalogCard = Pick<IProduct, 'image' | 'category'>;
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class CatalogCard extends Card<TCatalogCard> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = "card__category";
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.cardCategory.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.cardImage.src = value;
  }
}
