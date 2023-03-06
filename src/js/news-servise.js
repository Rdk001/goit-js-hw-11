import axios from 'axios';

export default class ApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async fetchData() {
    const API_KEY = '34125445-1c9917b2e51e42d8e5ff23e92';
    const BASE_URL = 'https://pixabay.com/api/';
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${this.query}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
