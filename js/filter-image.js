const imageUploadFormElement = document.querySelector('.img-upload__form');
const imageUploadPreviewElement = imageUploadFormElement.querySelector('.img-upload__preview img');
const sliderElement = imageUploadFormElement.querySelector('.effect-level__slider');
const sliderValueElement = imageUploadFormElement.querySelector('.effect-level__value');
const sliderContainerElement = imageUploadFormElement.querySelector('.img-upload__effect-level');
const effectsListElement = imageUploadFormElement.querySelector('.effects__list');

const EFFECT_OPTIONS = {
  none: {
    filter: null,
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    unit: ''
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    start: 3,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    start: 3,
    unit: ''
  }
};

let currentEffect = 'none';
let slider = null;

const updateFilter = (effect, value) => {
  const config = EFFECT_OPTIONS[effect];

  sliderValueElement.value = value;

  if (effect === 'none' || !config.filter) {
    imageUploadPreviewElement.style.filter = '';
    sliderContainerElement.classList.add('hidden');
    return;
  }

  imageUploadPreviewElement.style.filter = `${config.filter}(${value}${config.unit})`;
  sliderContainerElement.classList.remove('hidden');
};

const setEffect = (effect) => {
  if (effect === currentEffect) {
    return;
  }
  currentEffect = effect;
  const config = EFFECT_OPTIONS[effect];

  if (slider) {
    slider.updateOptions({
      range: {
        min: config.min,
        max: config.max,
      },
      start: config.start,
      step: config.step
    });
    const startValue = effect === 'none' ? '' : config.start;
    slider.set(startValue);
    updateFilter(effect, startValue);
  }
};

const onSliderChange = (values) => {
  const value = Number(values[0]);
  if (currentEffect !== 'none') {
    updateFilter(currentEffect, value);
  }
};

const onEffectChange = (evt) => {
  setEffect(evt.target.value);
};

const initSlider = () => {
  if (slider) {
    return;
  }

  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 1
    },
    start: 1,
    step: 0.1,
    connect: 'lower'
  });

  slider = sliderElement.noUiSlider;
  slider.on('update', onSliderChange);

  effectsListElement.addEventListener('change', onEffectChange);

  sliderContainerElement.classList.add('hidden');
  setEffect('none');
};

const resetSlider = () => {
  if (!slider) {
    return;
  }

  slider.off('update', onSliderChange);
  slider.destroy();
  slider = null;

  currentEffect = 'none';
  imageUploadPreviewElement.style.filter = '';
  sliderContainerElement.classList.add('hidden');
  sliderValueElement.value = '';
  effectsListElement.removeEventListener('change', onEffectChange);
};

export { initSlider, resetSlider };
