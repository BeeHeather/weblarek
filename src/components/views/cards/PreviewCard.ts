import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";

export class PreviewCard extends Card<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
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

  render(data?: Partial<IProduct>): HTMLElement {
    if (data) {
      if (data.title !== undefined) {
        this.title = data.title;
      }
      if (data.price !== undefined) {
        this.price = data.price;
      }
      if (data.category !== undefined) {
        this.category = data.category;
      }
      if (data.image !== undefined) {
        this.image = data.image;
      }
      if (data.description !== undefined) {
        this.description = data.description;
      }
    }
    return this.container;
  }
}
