import api from "../api.js";
import DarkModeSwitch from "./DarkModeSwitch.js";
import ImageInfo from "./ImageInfo.js";
import LoadingProgress from "./LoadingProgress.js";
import RandomCatBanner from "./RandomCatBanner.js";
import SearchInput from "./SearchInput.js";
import SearchResult from "./SearchResult.js";

console.log("app is running!");

export default class App {
  $target = null;
  data = [];
  isLoading = false;
  recentKeywords = [];
  currentPage = 1;
  keyword = "";

  constructor($target) {
    this.$target = $target;

    this.darkModeSwitch = new DarkModeSwitch({
      $target,
    });

    this.loadingProgress = new LoadingProgress({
      $target,
    });

    this.randomCatBanner = new RandomCatBanner({
      $target,
      initialData: [],
    });

    this.searchInput = new SearchInput({
      $target,
      onSearch: async (keyword) => {
        try {
          this.keyword = keyword;
          this.currentPage = 1;
          this.addKeyword(keyword);
          this.setLoading(true);

          const { data } = await api.fetchCats(keyword, this.currentPage);

          this.setState(data);
          this.saveState();
        } catch (error) {
          console.error(error);
          this.setState([]);
        } finally {
          this.setLoading(false);
        }
      },
      onRandomSearch: async () => {
        this.setLoading(true);

        try {
          const { data } = await api.fetchRandomCats();

          this.setState(data);
          this.saveState();
        } catch (error) {
          console.error(error);
          this.setState([]);
        } finally {
          this.setLoading(false);
        }
      },
    });

    this.searchResult = new SearchResult({
      $target,
      initialData: this.data,
      onClick: (image) => {
        this.imageInfo.setState({
          visible: true,
          image,
        });
      },
    });

    this.imageInfo = new ImageInfo({
      $target,
      data: {
        visible: false,
        image: null,
      },
    });

    this.loadState();
    this.addScrollEvent();
  }

  setLoading(value) {
    this.isLoading = value;
    this.loadingProgress.$LoadingProgress.style.display = value
      ? "block"
      : "none";
  }

  addScrollEvent() {
    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (!this.isLoading) {
          this.loadMore();
        }
      }
    });
  }

  async loadMore() {
    if (!this.hasMore || this.isLoading) return;

    this.setLoading(true);
    this.currentPage += 1;

    try {
      const { data } = await api.fetchCats(this.keyword, this.currentPage);

      if (data.length < 0) {
        this.hasMore = false;
      }

      this.setState([...this.data, ...data]);
      this.saveState();
    } catch (error) {
      console.error(error);
      this.setState([]);
    } finally {
      this.setLoading(false);
    }
  }

  addKeyword(keyword) {
    if (this.recentKeywords.includes(keyword)) {
      this.recentKeywords = this.recentKeywords.filter((kw) => kw !== keyword);
    }
    this.recentKeywords.unshift(keyword);
    if (this.recentKeywords.length > 5) {
      this.recentKeywords.pop();
    }
    this.searchInput.setKeywords(this.recentKeywords);
  }

  setState(nextData) {
    this.data = nextData;
    this.searchResult.setState(this.data);
  }

  saveState() {
    localStorage.setItem("lastSearch", JSON.stringify(this.data));
    localStorage.setItem("recentKeywords", JSON.stringify(this.recentKeywords));
  }

  loadState() {
    const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));
    const recentKeywords = JSON.parse(localStorage.getItem("recentKeywords"));

    if (lastSearch) {
      this.setState(lastSearch);
    }
    if (recentKeywords) {
      this.recentKeywords = recentKeywords;
      this.searchInput.setKeywords(this.recentKeywords);
    }
  }
}
