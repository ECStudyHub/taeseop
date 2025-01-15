/** 검색 인풋 */
export default class SearchInput {
  constructor({ $target, onSearch, onRandomSearch }) {
    const $wrapper = document.createElement("nav");
    const $searchInput = document.createElement("input");
    const $randomButton = document.createElement("button");
    const $keywords = document.createElement("div");

    this.$searchInput = $searchInput;
    this.$keywords = $keywords;

    $searchInput.placeholder = "고양이를 검색해보세요.|";
    $randomButton.textContent = "랜덤 검색";

    $searchInput.className = "SearchInput";
    $randomButton.className = "RandomButton";
    $keywords.className = "RecentKeywords";

    $wrapper.appendChild($searchInput);
    $wrapper.appendChild($randomButton);
    $wrapper.appendChild($keywords);
    $target.appendChild($wrapper);

    $searchInput.focus();

    $searchInput.addEventListener("click", (e) => {
      if ($searchInput.value) {
        $searchInput.value = "";
      }
    });

    $searchInput.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        onSearch(e.target.value);
      }
    });

    $randomButton.addEventListener("click", () => {
      onRandomSearch();
    });

    console.log("SearchInput created.", this);
  }

  setKeywords(keywords) {
    this.$keywords.innerHTML = keywords
      .map((keyword) => `<span class="keyword">${keyword}</span>`)
      .join("");

    this.$keywords.querySelectorAll(".keyword").forEach(($keyword) => {
      $keyword.addEventListener("click", (e) => {
        const keyword = e.target.textContent;
        this.$searchInput.value = keyword;
        this.$searchInput.dispatchEvent(
          new KeyboardEvent("keyup", { keyCode: 13 })
        );
      });
    });
  }

  render() {}
}
