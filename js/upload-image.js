import { isEscapeKey } from './util.js';
import { initPhotoScale, resetPhotoScale } from './scale-image.js';
import { resetValidateForms } from './validate.js';
import { initSlider, resetSlider } from './filter-image.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Идет публикация...'
};

const imageUploadFormElement = document.querySelector('.img-upload__form');
const imageUploadInputElement = imageUploadFormElement.querySelector('.img-upload__input');
const imageUploadOverlayElement = imageUploadFormElement.querySelector('.img-upload__overlay');
const imageUploadCancelElement = imageUploadFormElement.querySelector('.img-upload__cancel');
const hashTagFieldElement = imageUploadFormElement.querySelector('.text__hashtags');
const commentFieldElement = imageUploadFormElement.querySelector('.text__description');
const imageSubmitButtonElement = imageUploadFormElement.querySelector('.img-upload__submit');
const previewElement = imageUploadFormElement.querySelector('.img-upload__preview img');
const previewEffectImageElements = imageUploadFormElement.querySelectorAll('.effects__preview');

let imageUrl;

const blockSubmitButton = () => {
  imageSubmitButtonElement.disabled = true;
  imageSubmitButtonElement.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  imageSubmitButtonElement.disabled = false;
  imageSubmitButtonElement.textContent = SubmitButtonText.IDLE;
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    const openErrorMessage = document.querySelector('.error');
    if (openErrorMessage) {
      return;
    }
    evt.preventDefault();
    closeUploadForm();
  }
};

const onCancelButtonClick = () => {
  closeUploadForm();
};

const onFocusKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
    evt.target.blur();
  }
};

const openUploadForm = () => {
  imageUploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  initPhotoScale();
  initSlider();

  imageUploadCancelElement.addEventListener('click', onCancelButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  hashTagFieldElement.addEventListener('keydown', onFocusKeydown);
  commentFieldElement.addEventListener('keydown', onFocusKeydown);
};

function closeUploadForm () {
  imageUploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetPhotoScale();
  resetSlider();

  imageUploadCancelElement.removeEventListener('click', onCancelButtonClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  hashTagFieldElement.removeEventListener('keydown', onFocusKeydown);
  commentFieldElement.removeEventListener('keydown', onFocusKeydown);
  imageUploadInputElement.value = '';
  imageUploadFormElement.reset();
  resetValidateForms();

  URL.revokeObjectURL(imageUrl);
  previewEffectImageElements.forEach((previewImage) => {
    previewImage.style.backgroundImage = '';
  });
}

const initUploadImage = () => {
  imageUploadInputElement.addEventListener('change', (evt) => {
    evt.stopPropagation();
    const file = imageUploadInputElement.files[0];

    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((item) => fileName.endsWith(item));

    if (!matches) {
      return;
    }

    imageUrl = URL.createObjectURL(file);
    previewElement.src = imageUrl;

    previewEffectImageElements.forEach((previewImage) => {
      previewImage.style.backgroundImage = `url(${imageUrl})`;
    });

    openUploadForm();
  });
};

export { initUploadImage, closeUploadForm, blockSubmitButton, unblockSubmitButton };
