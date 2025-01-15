import api from "../api.js";

/** 이미지 상세 보기 모달 */
export default class ImageInfo {
  $imageInfo = null;
  data = null;

  constructor({ $target, data }) {
    const $imageInfo = document.createElement("div");
    $imageInfo.className = "ImageInfo";
    this.$imageInfo = $imageInfo;
    $target.appendChild($imageInfo);

    this.data = data;

    // 모달 닫기에 대한 이벤트 리스너 추가
    this.$imageInfo.addEventListener("click", (e) => {
      if (e.target === this.$imageInfo || e.target.className === "close") {
        this.close();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    });

    this.render();
  }

  setState(nextData) {
    this.data = nextData;

    if (nextData.visible && nextData.image) {
      // 고양이 상세 정보 불러오기
      api.fetchCatDetails(nextData.image.id).then(({ data }) => {
        this.data.image = { ...this.data.image, ...data };
        this.render();
      });
    } else {
      this.render();
    }
  }

  render() {
    if (this.data.visible) {
      const { name, url, temperament, origin } = this.data.image;

      this.$imageInfo.innerHTML = `
        <div class="content-wrapper">
          <div class="title">
            <span>${name}</span>
            <div class="close">x</div>
          </div>
          <img src="${url}" alt="${name}"/>        
          <div class="description">
            <div>성격: ${temperament ?? "해당 정보 없음"}</div>
            <div>태생: ${origin ?? "해당 정보 없음"}</div>
          </div>
        </div>`;
      this.$imageInfo.classList.add("visible");
    } else {
      this.$imageInfo.classList.remove("visible");
    }
  }

  close() {
    this.setState({
      visible: false,
      image: null,
    });
  }
}
