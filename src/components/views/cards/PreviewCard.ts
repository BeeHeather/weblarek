import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";

export type TPreviewCard = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>;
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}
export class PreviewCard extends Card<TPreviewCard> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;

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
    this.cardText = ensureElement<HTMLElement>(".card__text", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    if (actions?.onClick) {
      this.cardButton.addEventListener("click", actions.onClick);
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

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
