export default class DarkModeSwitch {
  $DarkModeSwitch = null;
  is_dark_mode = false;

  constructor({ $target }) {
    const $DarkModeSwitch = document.createElement("div");
    $DarkModeSwitch.className = "DarkModeSwitch";
    this.$DarkModeSwitch = $DarkModeSwitch;
    $target.appendChild($DarkModeSwitch);

    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode !== null) {
      this.is_dark_mode = JSON.parse(savedMode);
    } else {
      this.is_dark_mode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    this.applyTheme();
    this.render();
  }

  render() {
    this.$DarkModeSwitch.innerHTML = `
      <div class="dark-mode">
        <label>
          <input type="checkbox" ${this.is_dark_mode ? "checked" : ""} />
          다크모드
        </label>
      </div>
    `;

    this.$DarkModeSwitch
      .querySelector("input")
      .addEventListener("change", (e) => {
        this.is_dark_mode = e.target.checked;
        this.applyTheme();
        localStorage.setItem("dark-mode", JSON.stringify(this.is_dark_mode));
      });
  }

  applyTheme() {
    if (this.is_dark_mode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }
}
