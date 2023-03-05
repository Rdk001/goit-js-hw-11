import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './js/news-servise';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSearchQuery);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.style.display = 'none';

function onSearchQuery(e) {
  e.preventDefault();
  clearGallery();
  newsApiService.query = e.currentTarget.elements.searchQuery.value;
  if (!newsApiService.query) {
    refs.loadMoreBtn.style.display = 'none';
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  newsApiService.resetPage();
  newsApiService
    .featchCard()
    .then(data => {
      if (data.hits.length === 0) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderingCard(data.hits);
      if (data.hits.length !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(err => console.log(err));
  refs.loadMoreBtn.style.display = 'block';
}
function onLoadMore() {
  newsApiService
    .featchCard()
    .then(data => {
      renderingCard(data.hits);

      if (refs.gallery.children.length === data.totalHits) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => console.log(err));
  // const gallery = lightbox('.gallery__item').simpleLightbox();
  // gallery.refresh();
}

function renderingCard(data) {
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

  const lightbox = new SimpleLightbox('.gallery__item', { captionDelay: 250 });
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
