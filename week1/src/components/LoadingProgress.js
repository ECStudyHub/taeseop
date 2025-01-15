export default class LoadingProgress {
  $LoadingProgress = null;

  constructor({ $target }) {
    const $LoadingProgress = document.createElement("div");

    $LoadingProgress.className = "LoadingProgress";
    this.$LoadingProgress = $LoadingProgress;
    this.$LoadingProgress.style.display = "none";

    $target.appendChild($LoadingProgress);

    this.render();
  }

  render() {
    this.$LoadingProgress.innerHTML = `
      <div class="loading-progress">
        <h1>로딩중...</h1>
      </div>
    `;
  }
}
