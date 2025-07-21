<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useFetch } from '@/fetch'
import { formatCurrency } from '@/format'
import Icon from '@/components/Icon.vue'
import MainButton from '@/components/MainButton.vue'

const camera = useTemplateRef('camera');
const cutout = useTemplateRef('cutout');
const canvas = useTemplateRef('canvas');

const state = ref('start');
const cutoutPosition = ref({});
const receiptSum = ref(0);
const errorMessage = ref('');

const formattedSum = computed(() => formatCurrency(receiptSum.value));

onMounted(() => {
  const windowRect = cutout.value.getBoundingClientRect();
  cutoutPosition.value = {
    '--cutout-left': `${windowRect.left}px`,
    '--cutout-top': `${windowRect.top}px`,
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
        throw new Error(data);
      }
    }).catch((error) => {
      state.value = 'error';
      errorMessage.value = error;
      console.error(error);
    });
  }, 'image/jpeg');
}

function cancel() {
  window.history.back();
}
</script>

<template>
  <div class="scan" :style="cutoutPosition">
    <video ref="camera" class="scan__camera" autoplay disablepictureinpicture muted playsinline></video>
    <div :class="['scan__overlay', { mask: state == 'scan' }]">
      <div class="scan__container">
        <canvas ref="canvas"></canvas>
        <div ref="cutout" v-show="state == 'start' || state == 'scan'" class="scan__window">
          <div v-show="state == 'start'" class="scan__instruction">
            <Icon name="qrcode" />
            <div>Отсканируйте QR-код, расположенный внизу чека</div>
          </div>
        </div>
        <svg class="scan__mask" width="100%" height="100%">
          <mask id="scanWindow">
            <rect class="scan__cutout" width="100%" height="100%" rx="15" x="5" y="5" fill="white" />
          </mask>
        </svg>
        <div v-show="state == 'result'" class="scan__result">
          <img src="/images/scan-success.png">
          <div class="scan__sum block">
            <div>Вы потратили</div>
            <div class="scan__amount gradient-text">{{ formattedSum }}</div>
          </div>
        </div>
        <div v-show="state == 'error'" class="scan__result scan__error">
          <img src="/images/scan-error.png">
          <div>Ошибка сканирования!<br>{{ errorMessage }}</div>
        </div>
      </div>
      <div class="scan__buttons">
        <MainButton v-show="state == 'start'" @click="state = 'scan'">Начать!</MainButton>
        <MainButton v-show="state == 'scan'" icon="scan" @click="captureImage">Отсканировать чек</MainButton>
        <MainButton v-show="state == 'error'" icon="retry" @click="state = 'scan'">Сканировать снова</MainButton>
        <MainButton v-show="state == 'result'" href="/review">Продолжить</MainButton>

        <button class="secondary-button" v-show="state == 'result'" @click="state = 'scan'">Неверная сумма</button>
        <button class="secondary-button" v-show="state != 'result'" @click="cancel">Отмена</button>
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
    -webkit-backdrop-filter: blur(24px);
    backdrop-filter: blur(24px);
    padding: 36px;

    &.mask {
      mask-image: linear-gradient(white, white), url(#scanWindow);
      mask-composite: subtract;
    }
  }

  &__container {
    display: grid;
    position: relative;
    max-height: 443px;
    margin-bottom: 70px;
    flex: 1;
  }

  &__window {
    border: 5px solid #FFF;
    border-radius: 20px;
  }

  &__mask {
    position: absolute;
    border: 5px solid transparent;
  }

  &__instruction {
    display: grid;
    height: 100%;
    gap: 28px;
    place-content: center;
    place-items: center;
    background: var(--theme-glass);
    color: var(--theme-40);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.04em;
    text-align: center;
    padding: 24px;
  }

  &__cutout {
    translate: var(--cutout-left) var(--cutout-top);
  }

  &__result {
    display: grid;
    font-size: 16px;
    font-weight: 700;
    margin: auto;
    text-align: center;
    justify-items: center;

    img {
      width: 191px;
    }
  }

  &__sum {
    padding: 13px 23px;
  }

  &__error {
    color: var(--theme-98);
  }

  &__amount {
    font-size: 24px;
  }

  &__buttons {
    color: var(--black-80);
  }
}
</style>
