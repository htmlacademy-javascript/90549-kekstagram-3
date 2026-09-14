import { shuffleArray, debounce } from './util.js';

const RANDOM_PHOTO_COUNT = 10;

const pictureTemplateElement = document.querySelector('#picture').content.querySelector('.picture');
const pictureContainerElement = document.querySelector('.pictures');
const filterContainerElement = document.querySelector('.img-filters');

let activeFilterButtonElement;

const renderPictureList = (data, filterId = 'filter-default') => {
  const similarListFragment = document.createDocumentFragment();

  let pictures = [...data];

  if (filterId === 'filter-random') {
    pictures = shuffleArray(pictures).slice(0, RANDOM_PHOTO_COUNT);
  } else if (filterId === 'filter-discussed') {
    pictures.sort((a, b) => b.comments.length - a.comments.length);
  }

  pictures.forEach(({id, url, description, likes, comments}) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);
    const pictureElementImg = pictureElement.querySelector('.picture__img');
    pictureElement.dataset.id = id;
    pictureElementImg.src = url;
    pictureElementImg.alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    similarListFragment.append(pictureElement);
  });

  const oldPictures = pictureContainerElement.querySelectorAll('.picture');
  oldPictures.forEach((picture) => picture.remove());

  pictureContainerElement.append(similarListFragment);
};

const renderPictureListDebounced = debounce(renderPictureList);

const initFilters = (data) => {
  filterContainerElement.classList.remove('img-filters--inactive');
  activeFilterButtonElement = filterContainerElement.querySelector('.img-filters__button--active');

  filterContainerElement.addEventListener('click', (evt) => {
    const target = evt.target.closest('.img-filters__button');
    if (!target || target.classList.contains('img-filters__button--active')) {
      return;
    }

    if (activeFilterButtonElement) {
      activeFilterButtonElement.classList.remove('img-filters__button--active');
    }

    target.classList.add('img-filters__button--active');
    activeFilterButtonElement = target;

    renderPictureListDebounced(data, target.id);
  });
};

export { renderPictureList, initFilters };
