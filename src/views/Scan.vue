<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useFetch } from '@/fetch.js'
import { formatCurrency } from '@/format.js'
import Icon from '@/components/Icon.vue'
import MainButton from '@/components/MainButton.vue'

const camera = useTemplateRef('camera');
const cutout = useTemplateRef('cutout');
const canvas = useTemplateRef('canvas');

const state = ref('start');
const windowRect = ref({});
const receiptSum = ref(0);
const errorMessage = ref('');

const cutoutPosition = computed(() => ({
  '--cutout-left': `${windowRect.value.left}px`,
  '--cutout-top': `${windowRect.value.top}px`,
}));

const formattedSum = computed(() => formatCurrency(receiptSum.value));

onMounted(() => {
  windowRect.value = cutout.value.getBoundingClientRect();

  navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => camera.value.srcObject = stream)
    .catch(console.error);
});

function captureImage() {
  const ctx = canvas.value.getContext('2d');
  const frameWidth = camera.value.videoWidth;
  const frameHeight = camera.value.videoHeight;
  canvas.value.width = frameWidth;
  canvas.value.height = frameHeight;
  ctx.drawImage(camera.value, 0, 0);
  canvas.value.toBlob((blob) => {
    const body = new FormData();
    body.append('receipt', new File([blob], 'receipt.jpg'));
    useFetch('receipts', null, {
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
        state.value = 'result';
      } else {
        state.value = 'error';
        errorMessage.value = data.message;
        console.error(data);
      }
    });
  }, 'image/jpeg');
}
</script>

<template>
  <div class="content scan" :style="cutoutPosition">
    <video ref="camera" class="scan__camera" autoplay disablepictureinpicture muted playsinline></video>
    <div class="scan__overlay">
      <div class="scan__container">
        <canvas ref="canvas"></canvas>
        <div v-if="state == 'result'" class="scan__result block">
          <div>Вы потратили</div>
          <div class="scan__amount gradient-text">{{ formattedSum }}</div>
        </div>
        <div v-else-if="state == 'error'" class="scan__error">
          <img src="/images/error.svg">
          <div>Ошибка сканирования!<br>{{ errorMessage }}</div>
        </div>
        <div v-else ref="cutout" class="scan__window">
          <div v-if="state == 'start'" class="scan__instruction">
            <Icon name="qrcode" size=110 />
            <div>Отсканируйте QR-код, расположенный внизу чека</div>
          </div>
          <svg class="scan__mask" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <mask id="scan-window">
              <rect v-if="state == 'scan'" class="scan__cutout" width="100%" height="100%" rx="15" fill="white"/>
            </mask>
          </svg>
        </div>
      </div>
      <div class="scan__button">
        <MainButton v-if="state == 'start'" @click="state = 'scan'">Начать!</MainButton>
        <MainButton v-else-if="state == 'scan'" icon="scan" @click="captureImage">Отсканировать чек</MainButton>
        <MainButton v-else-if="state == 'error'" icon="scan" @click="state = 'scan'">Сканировать снова</MainButton>
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

  canvas {
    display: none;
  }

  &__camera {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--black);
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
    max-height: 443px;
    margin-bottom: 70px;
    flex: 1;
  }

  &__window {
    position: relative;
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
    background: var(--theme-glass);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.04em;
    text-align: center;
    padding: 24px;
  }

  &__mask {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
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

  &__error {
    display: grid;
    gap: 25px;
    color: var(--theme-98);
    font-size: 18px;
    font-weight: 700;
    margin: auto;
    justify-items: center;
    text-align: center;

    img {
      filter: drop-shadow(0 2px 4px var(--theme-drop-shadow));
    }
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
    color: var(--theme-98);
    font-size: 14px;
    text-decoration: underline;
  }
}
</style>
