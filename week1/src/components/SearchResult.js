export default class SearchResult {
  $searchResult = null;
  data = null;
  onClick = null;

  constructor({ $target, initialData, onClick }) {
    this.$searchResult = document.createElement("main");
    this.$searchResult.className = "SearchResult";
    $target.appendChild(this.$searchResult);

    this.data = initialData;
    this.onClick = onClick;

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    this.$searchResult.addEventListener("click", (event) =>
      this.handleClick(event)
    );

    this.render();
  }

  setState(nextData) {
    this.data = nextData;
    this.render();
  }

  handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }

  handleClick(event) {
    /** Event Delegation */
    const $item = event.target.closest(".item");

    if ($item) {
      const index = Array.from(this.$searchResult.children).indexOf($item);
      if (index !== -1) {
        this.onClick(this.data[index]);
      }
    }
  }

  render() {
    if (!this.data || this.data?.length === 0) {
      this.$searchResult.innerHTML = `<h1>검색 결과가 없습니다</h1>`;
    } else {
      this.$searchResult.innerHTML = this.data
        ?.map(
          (cat) => `
            <article class="item">
              <img data-src=${cat.url} alt=${cat.name} />
              <div class="cat-name" style="display: none;">${cat.name}</div>
            </article>
          `
        )
        .join("");

      this.$searchResult.querySelectorAll(".item img").forEach((img) => {
        this.observer.observe(img);
      });

      this.$searchResult.querySelectorAll(".item").forEach(($item) => {
        const catName = $item.querySelector(".cat-name");

        $item.addEventListener("mouseover", () => {
          catName.style.display = "block";
        });

        $item.addEventListener("mouseout", () => {
          catName.style.display = "none";
        });
      });
    }
  }
}
