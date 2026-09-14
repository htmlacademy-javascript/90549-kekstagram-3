import { isEscapeKey } from './util.js';

const AVATAR_WIDTH = 35;
const AVATAR_HEIGHT = 35;
const COMMENTS_STEP = 5;

const bigPictureElement = document.querySelector('.big-picture');
const imageElement = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentShowCountElement = bigPictureElement.querySelector('.social__comment-shown-count');
const commentTotalCountElement = bigPictureElement.querySelector('.social__comment-total-count');
const commentsListElement = bigPictureElement.querySelector('.social__comments');
const captionElement = bigPictureElement.querySelector('.social__caption');
const bigPictureCloseButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const commentLoaderButtonElement = bigPictureElement.querySelector('.social__comments-loader');

const commentsListFragment = document.createDocumentFragment();

let commentsCount = COMMENTS_STEP;
let currentComments = [];

const createHTMLElement = (tagName, className) => {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
};

const renderComment = (data) => {
  const listItemElement = createHTMLElement('li', 'social__comment');
  const avatarElement = createHTMLElement('img', 'social__picture');
  const messageElement = createHTMLElement('p', 'social__text');
  avatarElement.src = data.avatar;
  avatarElement.alt = data.name;
  avatarElement.width = AVATAR_WIDTH;
  avatarElement.height = AVATAR_HEIGHT;
  messageElement.textContent = data.message;

  listItemElement.append(avatarElement);
  listItemElement.append(messageElement);

  return listItemElement;
};

const renderComments = () => {
  commentsListElement.innerHTML = '';
  commentShowCountElement.innerHTML = '';

  commentsCount = (commentsCount > currentComments.length) ? currentComments.length : commentsCount;
  commentShowCountElement.textContent = commentsCount;
  commentTotalCountElement.textContent = currentComments.length;

  currentComments.slice(0, commentsCount).forEach((comment) => {
    commentsListFragment.append(renderComment(comment));
  });

  if (currentComments.length <= COMMENTS_STEP || commentsCount >= currentComments.length) {
    commentLoaderButtonElement.classList.add('hidden');
  } else {
    commentLoaderButtonElement.classList.remove('hidden');
  }

  commentsListElement.append(commentsListFragment);
};

const fillBigPicture = ({url, description, likes}) => {
  imageElement.src = url;
  imageElement.alt = description;
  likesCountElement.textContent = likes;
  captionElement.textContent = description;
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const onLoadCommentsButtonClick = () => {
  commentsCount += COMMENTS_STEP;
  renderComments();
};

const openBigPicture = (data) => {
  currentComments = [...data.comments];
  fillBigPicture(data);
  renderComments();
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

function closeBigPicture () {
  commentsCount = COMMENTS_STEP;
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
}

commentLoaderButtonElement.addEventListener('click', onLoadCommentsButtonClick);

bigPictureCloseButtonElement.addEventListener('click', () => {
  closeBigPicture();
});

const initBigPicture = (picturesContainer, pictures) => {
  picturesContainer.addEventListener('click', (evt) => {
    if (evt.target.closest('.img-upload__input') ||
        evt.target.closest('.img-upload__label') ||
        evt.target.closest('.img-upload__form') ||
        evt.target.closest('.img-upload__submit')) {
      return;
    }

    evt.preventDefault();
    const thumbnail = evt.target.closest('.picture');
    if (!thumbnail) {
      return;
    }

    const pictureId = parseInt(thumbnail.dataset.id, 10);
    const pictureData = pictures.find((item) => item.id === pictureId);
    if (pictureData) {
      openBigPicture(pictureData);
    }
  });
};

export { initBigPicture };
