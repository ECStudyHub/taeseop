import api from "../api.js";

export default class RandomCatBanner {
  $banner = null;
  data = [];
  currentIndex = 0;

  constructor({ $target }) {
    this.$banner = document.createElement("header");
    this.$banner.className = "RandomCatBanner";
    $target.appendChild(this.$banner);

    this.initialize();
  }

  async initialize() {
    try {
      const { data } = await api.fetchRandomCats();

      this.data = data;
      this.render();
    } catch (error) {
      console.error(error);
      this.$banner.innerHTML = `<p>랜덤 고양이를 불러오는 데 실패했습니다.</p>`;
    }
  }

  render() {
    if (this.data.length === 0) {
      this.$banner.innerHTML = `<p>랜덤 고양이를 불러오는 중입니다...</p>`;
      return;
    }

    const currentCats = this.data.slice(
      this.currentIndex,
      this.currentIndex + 5
    );

    this.$banner.innerHTML = `
        <button class="prev">◀</button>
        <div class="cats">
          ${currentCats
            .map(
              (cat) => `
              <img src="${cat.url}" alt="${cat.name}" />
            `
            )
            .join("")}
        </div>
        <button class="next">▶</button>
      `;

    this.$banner
      .querySelector(".prev")
      .addEventListener("click", () => this.prev());
    this.$banner
      .querySelector(".next")
      .addEventListener("click", () => this.next());
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.render();
    }
  }

  next() {
    if (this.currentIndex < this.data.length - 5) {
      this.currentIndex += 1;
      this.render();
    }
  }
}
