<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import MainButton from '@/components/MainButton.vue'

const state = ref('start');

const camera = useTemplateRef('camera');
const cutout = useTemplateRef('cutout');
const canvas = useTemplateRef('canvas');
const windowRect = ref({});

onMounted(() => {
  windowRect.value = cutout.value.getBoundingClientRect();

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => camera.value.srcObject = stream)
    .catch(console.error);
});

const cutoutPosition = computed(() => ({
  '--cutout-left': `${windowRect.value.left}px`,
  '--cutout-top': `${windowRect.value.top}px`,
}));

function captureImage() {
  const ctx = canvas.value.getContext('2d');
  const frameWidth = camera.value.videoWidth;
  const frameHeight = camera.value.videoHeight;
  // const frameWidth = windowRect.value.width;
  // const frameHeight = windowRect.value.height;
  canvas.value.width = frameWidth;
  canvas.value.height = frameHeight;
  ctx.drawImage(camera.value, 0, 0);
  canvas.value.toBlob((blob) => {}, 'image/jpeg');
  state.value = 'result';
}
</script>

<template>
  <div class="content scan" :style="cutoutPosition">
    <video ref="camera" class="scan__camera" autoplay disablepictureinpicture muted playsinline></video>
    <div class="scan__overlay">
      <div class="scan__container">
        <canvas ref="canvas" style="display:none"></canvas>
        <div v-if="state != 'result'" ref="cutout" class="scan__window">
          <div v-if="state == 'start'" class="scan__instruction">
            <img src="/images/vaadin_qrcode.svg">
            <div>Отсканируйте QR-код, расположенный внизу чека</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <mask id="scan-window">
              <rect v-if="state == 'scan'" class="scan__cutout" width="100%" height="100%" rx="15" fill="white"/>
            </mask>
          </svg>
        </div>
        <div v-if="state == 'result'" class="scan__result block">
          <div>Вы потратили</div>
          <div class="scan__amount gradient-text">4 010₽</div>
        </div>
      </div>
      <div class="scan__button">
        <MainButton v-if="state == 'start'" @click="state = 'scan'">Начать!</MainButton>
        <MainButton v-else-if="state == 'scan'" icon="scan" @click="captureImage">Отсканировать чек</MainButton>
        <MainButton v-else href="/review">Продолжить</MainButton>
        <button v-if="state == 'result'" class="scan__retry" @click="state = 'scan'">Неверная сумма</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scan {
  position: fixed;
  inset: 0;

  &__camera {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #000;
    object-fit: cover;
  }

  &__overlay {
    display: flex;
    flex-flow: column;
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(24px);
    padding: 36px;
    mask-image: linear-gradient(white, white), url(#scan-window);
    mask-composite: subtract;
  }

  &__container {
    display: grid;
    position: relative;
    max-height: 443px;
    margin-bottom: 70px;
    flex: 1;

    svg,
    canvas {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__window {
    height: 100%;
    border-radius: 15px;
    outline: 5px solid #FFF;

  }

  &__instruction {
    display: grid;
    height: 100%;
    gap: 28px;
    place-content: center;
    place-items: center;
    background: rgb(255 255 255 / 50%);
    color: var(--font-black-30);
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    padding: 36px;
  }

  &__cutout {
    translate: var(--cutout-left) var(--cutout-top);
  }

  &__result {
    display: grid;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    margin: auto;
    padding: 30px;
    text-align: center;
  }

  &__amount {
    font-size: 24px;
  }

  &__button {
    display: grid;
    gap: 16px;
    justify-items: center;
  }

  &__retry {
    color: #FFF;
    font-size: 14px;
    text-decoration: underline;
  }
}
</style>
