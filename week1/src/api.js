const API_ENDPOINT =
  "https://q9d70f82kd.execute-api.ap-northeast-2.amazonaws.com/dev";

const request = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // 상태 코드에 따라 에러 메시지 처리
      switch (response.status) {
        case 400:
          throw new Error("잘못된 요청입니다.");
        case 404:
          throw new Error("리소스를 찾을 수 없습니다.");
        case 500:
          throw new Error("서버 오류가 발생했습니다.");
        default:
          throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
    return await response.json();
  } catch (e) {
    console.error(e.message);
    throw e;
  }
};

const api = {
  /** 고양이 검색 결과 */
  fetchCats: (keyword, page = 1) => {
    return request(`${API_ENDPOINT}/api/cats/search?q=${keyword}&page=${page}`);
  },

  /** 고양이 상세정보 */
  fetchCatDetails: (id) => {
    return request(`${API_ENDPOINT}/api/cats/${id}`);
  },

  /** 고양이 랜덤 검색 */
  fetchRandomCats: () => {
    return request(`${API_ENDPOINT}/api/cats/random50`);
  },
};

export default api;
