<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import useEventBus from '@/eventBus';
import useFetch from '@/fetch';
import { formatCurrency } from '@/funcs';

import SVGIcon from '@/components/SVGIcon.vue';
import MainButton from '@/components/MainButton.vue';

const { emit } = useEventBus();

const isTutorial = defineModel('isTutorial');

const camera = useTemplateRef('camera');
const cutout = useTemplateRef('cutout');
const canvas = useTemplateRef('canvas');

const state = ref('start');
const cutoutPosition = ref({});
const receiptSum = ref(0);
const errorMessage = ref('Пожалуйста, повторите попытку.');

const formattedSum = computed(() => formatCurrency(receiptSum.value));

onMounted(() => {
  cutoutPosition.value = {
    '--cutout-left': `${cutout.value.offsetLeft}px`,
    '--cutout-top': `${cutout.value.offsetTop}px`,
  };

  navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => camera.value.srcObject = stream)
    .catch(console.error);
});

function captureImage() {
  const ctx = canvas.value.getContext('2d');
  canvas.value.width = camera.value.videoWidth;
  canvas.value.height = camera.value.videoHeight;
  ctx.drawImage(camera.value, 0, 0);
  canvas.value.toBlob(sendImage, 'image/jpeg');
}

function sendImageFromGallery(event) {
  const file = event.target.files[0];
  sendImage(file);
  event.target.value = null;
}

function sendImage(image) {
  const body = new FormData();
  body.append('receipt', image);
  useFetch('receipts', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body
  }).then(({ data, ok }) => {
    if (ok) {
      let url = new URL(window.location.href);
      url.search = new URLSearchParams(data);
      window.history.replaceState(null, '', url);
      receiptSum.value = data.total_sum;
      state.value = 'success';
    } else {
      throw new Error(data.message);
    }
  }).catch((error) => {
    state.value = 'error';
    errorMessage.value = error.message;
    console.error(error);
  });
}

function cancel() {
  window.history.back();
}
</script>

<template>
  <div class="scan" :style="cutoutPosition">
    <video
      ref="camera"
      class="scan__camera"
      autoplay
      disablepictureinpicture
      muted
      playsinline
    ></video>
    <canvas ref="canvas"></canvas>
    <div :class="['scan__overlay', { mask: state == 'scan' }]"></div>
    <div class="scan__content">
      <div ref="cutout" class="scan__container">
        <div v-show="state == 'start' || state == 'scan'" class="scan__window">
          <div v-show="state == 'start'" class="scan__instruction">
            <SVGIcon name="qrcode" />
            <div>Отсканируйте QR-код, расположенный внизу чека</div>
          </div>
        </div>
        <svg class="scan__mask" width="100%" height="100%">
          <mask id="scanWindow">
            <rect class="scan__cutout" width="100%" height="100%" rx="20" fill="white" />
          </mask>
        </svg>
        <div v-show="state == 'success'" class="scan__result scan__result--success">
          <img src="/images/scan-success.png">
          <div class="scan__result-block block">
            <div>Сумма чека</div>
            <div class="scan__amount gradient-text">{{ formattedSum }}</div>
          </div>
        </div>
        <div v-show="state == 'error'" class="scan__result scan__result--error">
          <img src="/images/scan-error.png">
          <div class="scan__result-block scan__result-block--error block">
            <h2>Ошибка сканирования!</h2>
            <div>{{ errorMessage }}</div>
          </div>
        </div>
      </div>
      <div class="scan__buttons">
        <label v-show="state == 'start' || state == 'scan'" class="scan__gallery">
          <SVGIcon name="gallery" />
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .pdf, .tiff, .heic"
            @change="sendImageFromGallery"
          >
        </label>

        <MainButton
          v-show="state == 'start'"
          class="tutorial-3"
          @click="isTutorial ? emit('tutorialStep') : state = 'scan'"
        >Начать!</MainButton>
        <MainButton
          v-show="state == 'scan'"
          icon="scan"
          @click="captureImage"
        >Отсканировать чек</MainButton>
        <MainButton
          v-show="state == 'error'"
          icon="retry"
          @click="state = 'scan'"
        >Сканировать снова</MainButton>
        <MainButton
          v-show="state == 'success'"
          href="/review"
        >Продолжить</MainButton>

        <button
          v-show="state == 'success'"
          class="secondary-button"
          @click="state = 'scan'"
        >Неверная сумма</button>
        <button
          v-show="state != 'success'"
          class="secondary-button"
          @click="cancel"
        >Отмена</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scan {
  canvas {
    display: none;
  }

  &__camera {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #000;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(24px);

    &.mask {
      mask-image: linear-gradient(white, white), url(#scanWindow);
      mask-composite: subtract;
    }
  }

  &__content {
    display: flex;
    position: relative;
    height: 100%;
    flex-flow: column;
    padding: 32px 32px 24px;
  }

  &__container {
    display: grid;
    position: relative;
    max-height: 443px;
    margin-bottom: 24px;
    flex: 1;
  }

  &__window {
    outline: 5px solid #FFF;
    border-radius: 20px;
  }

  &__mask {
    position: absolute;
  }

  &__instruction {
    display: grid;
    height: 100%;
    gap: 28px;
    place-content: center;
    place-items: center;
    background: var(--theme-glass);
    border-radius: inherit;
    color: var(--theme-40);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.04em;
    padding: 24px;
    text-align: center;
  }

  &__cutout {
    translate: var(--cutout-left) var(--cutout-top);
  }

  &__result {
    display: grid;
    align-self: center;
    justify-items: center;
    font-size: 16px;
    text-align: center;

    &--error {
      color: #999999;
      font-size: 14px;
      line-height: 1.4;
    }

    img {
      width: 200px;
    }

    &-block {
      display: grid;
      gap: 8px;
      border-radius: 16px;
      line-height: 1;
      padding: 13px 30px;
      opacity: 0.8;

      &--error {
        width: 100%;
        background: #333;
        border-radius: 24px;
        box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
        padding: 18px;

        h2 {
          color: #E6E6E6;
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }

  &__amount {
    font-size: 18px;
    font-weight: 700;
  }

  &__buttons {
    display: grid;
    justify-items: center;
    color: #CCCCCC;
    margin-top: auto;
  }

  &__gallery {
    width: 60px;
    height: 60px;
    background: #333;
    border-radius: 16px;
    margin-bottom: 24px;
    padding: 12px;
  }
}
</style>
