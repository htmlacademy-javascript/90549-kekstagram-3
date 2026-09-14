import { sendData } from './api.js';
import { showMessage } from './util.js';
import { blockSubmitButton, unblockSubmitButton } from './upload-image.js';

const PATTERN_HASH = /^#[a-zа-яё0-9]{1,19}$/i;
const HASHTAG_COUNT = 5;
const LENGTH_COMMENT = 140;

const ERROR_MESSAGES = {
  invalidHashtag: 'введён невалидный хэштег (от 1 до 20 символов, включая решётку)',
  hashtagLimitExceeded: 'превышено количество хэштегов',
  duplicateHashtags: 'хэштеги повторяются',
  commentTooLong: 'длина комментария больше 140 символов'
};

const imageUploadFormElement = document.querySelector('.img-upload__form');
const hashTagFieldElement = imageUploadFormElement.querySelector('.text__hashtags');
const commentFieldElement = imageUploadFormElement.querySelector('.text__description');
const messageSuccessElement = document.querySelector('#success').content.querySelector('.success');
const messageErrorElement = document.querySelector('#error').content.querySelector('.error');

const pristine = new Pristine(imageUploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const isEmpty = (value) => !value || value.trim() === '';

const getHashtags = (value) => {
  if (!value || value.trim() === '') {
    return [];
  }
  return value.trim().split(/\s+/);
};

const validateHashtagFormat = (value) => {
  if (isEmpty(value)) {
    return true;
  }

  const hashTags = getHashtags(value);
  return hashTags.every((tag) => PATTERN_HASH.test(tag));
};

const validateHashtagCount = (value) => {
  if (isEmpty(value)) {
    return true;
  }

  const hashtags = getHashtags(value);
  return hashtags.length <= HASHTAG_COUNT;
};

const validateHashtagUnique = (value) => {
  if (isEmpty(value)) {
    return true;
  }

  const hashtags = getHashtags(value);
  const lowerCaseTags = hashtags.map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

const validateCommentLength = (value) => {
  const stringLength = value.length;
  return stringLength <= LENGTH_COMMENT;
};

pristine.addValidator(hashTagFieldElement, validateHashtagFormat, ERROR_MESSAGES.invalidHashtag);
pristine.addValidator(hashTagFieldElement, validateHashtagCount, ERROR_MESSAGES.hashtagLimitExceeded);
pristine.addValidator(hashTagFieldElement, validateHashtagUnique, ERROR_MESSAGES.duplicateHashtags);
pristine.addValidator(commentFieldElement, validateCommentLength, ERROR_MESSAGES.commentTooLong);

const setUserFormSubmit = (onSuccess) => {
  imageUploadFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(onSuccess)
        .then(() => {
          showMessage(messageSuccessElement);
        })
        .catch(() => {
          showMessage(messageErrorElement);
        })
        .finally(unblockSubmitButton);
    }
  });
};

const resetValidateForms = () => {
  pristine.reset();
};

export { setUserFormSubmit, resetValidateForms };
