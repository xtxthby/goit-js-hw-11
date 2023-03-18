     
import NewsApiService from './js/api-servise';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearGalleryMarkup();

  const search = e.currentTarget.elements.searchQuery.value;

  newsApiService.query = search.trim();

  if (!search.trim()) {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(`Please enter your reqest.`);
    return;
  }

  newsApiService.resetPage();

  loadMoreBtn.disable();

  const getData = async () => {
    try {
      const data = await newsApiService.fetchArticles();

      if (data.totalHits === 0) {
        loadMoreBtn.hide();

        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }

      loadMoreBtn.show();
      loadMoreBtn.enable();

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      appendPhotoHitsMurkup(data.hits);

      newsApiService.incrementPage();
    } catch (error) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      console.log(error);
    }
  };
  getData();
}
function onLoadMore(e) {
  loadMoreBtn.disable();

  const getData = async () => {
    try {
      const data = await newsApiService.fetchArticles();

      checkEndOfPage(data);

      loadMoreBtn.enable();

      appendPhotoHitsMurkup(data.hits);

      newsApiService.incrementPage();

      smoothScroll();
    } catch (error) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      console.log(error);
    }
  };
  getData();
}

function appendPhotoHitsMurkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createPhotoMarkup(hits));
  let gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  gallery.refresh();
}

function createPhotoMarkup(searchQuery) {
  return searchQuery.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `<div class="photo-card">
    <a class='gallery__link' href='${largeImageURL}'>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='400px' />
  </a>
  <div class="info">
    <div>
      <p class="info-item">
        <b>Likes</b>
      <p class="info-item">${likes}</p>
      </p>
    </div>
    <div>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">${views}</p>
    </div>
    <div>
      <p class="info-item">
        <b>Comments</b>
        <p class="info-item">${comments}</p>
      </p>
    </div>
    <div>
      <p class="info-item">
        <b>Downloads</b>
        <p class="info-item">${downloads}</p>
      </p>
    </div>
  </div>
</div>`
  );
}

function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}

function checkEndOfPage(data) {
  const allPages = Math.ceil(data.totalHits / newsApiService.per_page);

  if (newsApiService.page > allPages) {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
