import { Component } from "../base/Component";

export interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data?: IGalleryData): HTMLElement {
    if (data?.items) {
      this.container.innerHTML = "";
      this.container.append(...data.items);
    }
    return this.container;
  }
}
