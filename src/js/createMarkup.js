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
  ).join('');
}

export { createPhotoMarkup };