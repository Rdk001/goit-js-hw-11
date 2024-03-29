import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ApiService from './js/news-servise';
const apiService = new ApiService();

let lightbox = null;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchQuery);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.style.display = 'none';

async function onSearchQuery(e) {
  e.preventDefault();
  clearGallery();

  apiService.query = e.currentTarget.elements.searchQuery.value;

  if (!apiService.query) {
    refs.loadMoreBtn.style.display = 'none';
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  apiService.resetPage();

  try {
    const data = await apiService.fetchData();

    if (!data.hits.length) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderCards(data.hits);

    lightbox = new SimpleLightbox('.gallery__item', { captionDelay: 250 });

    if (data.hits.length) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
  } catch (error) {
    console.log(error);
  }

  refs.loadMoreBtn.style.display = 'block';
}

async function onLoadMore() {
  try {
    const data = await apiService.fetchData();

    renderCards(data.hits);
    lightbox.refresh();

    if (refs.gallery.children.length === data.totalHits) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function renderCards(data) {
  let card = data
    .map(
      item =>
        `<a class="gallery__item" href="${item.largeImageURL}">
      <div class="photo-card">
    <img class="gallery__image" src=${item.webformatURL} alt="" title="${item.tags}" loading="lazy"/>
  
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${item.downloads}
      </p>
    </div>
  </div></a>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', card);
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
