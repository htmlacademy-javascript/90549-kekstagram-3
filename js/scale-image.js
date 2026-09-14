const SCALE_CONTROL_STEP = 25;
const SCALE_CONTROL_MIN = 25;
const SCALE_CONTROL_MAX = 100;
const SCALE_CONTROL_DEFAULT = 100;

const imageUploadFormElement = document.querySelector('.img-upload__form');
const scaleControlSmallerElement = imageUploadFormElement.querySelector('.scale__control--smaller');
const scaleControlBiggerElement = imageUploadFormElement.querySelector('.scale__control--bigger');
const scaleControlValueElement = imageUploadFormElement.querySelector('.scale__control--value');
const imageUploadPreviewElement = imageUploadFormElement.querySelector('.img-upload__preview img');

let currentValue = SCALE_CONTROL_DEFAULT;

const updateScale = (value) => {
  if (value < SCALE_CONTROL_MIN) {
    value = SCALE_CONTROL_MIN;
  }

  if (value > SCALE_CONTROL_MAX) {
    value = SCALE_CONTROL_MAX;
  }

  currentValue = value;

  scaleControlValueElement.value = `${currentValue}%`;

  const scaleTransform = currentValue / 100;
  imageUploadPreviewElement.style.transform = `scale(${scaleTransform})`;
};

const onScaleControlSmallerClick = () => {
  updateScale(currentValue - SCALE_CONTROL_STEP);
};

const onScaleControlBiggerClick = () => {
  updateScale(currentValue + SCALE_CONTROL_STEP);
};

const initPhotoScale = () => {
  updateScale(SCALE_CONTROL_DEFAULT);
  scaleControlSmallerElement.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBiggerElement.addEventListener('click', onScaleControlBiggerClick);
};

const resetPhotoScale = () => {
  updateScale(SCALE_CONTROL_DEFAULT);
  scaleControlSmallerElement.removeEventListener('click', onScaleControlSmallerClick);
  scaleControlBiggerElement.removeEventListener('click', onScaleControlBiggerClick);
};

export { initPhotoScale, resetPhotoScale };
