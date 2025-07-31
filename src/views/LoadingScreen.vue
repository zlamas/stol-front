<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  activeTheme: String,
});

const line = ref('');

const lines = [
  "Хвалим поваров...",
  "Договариваемся о брони...",
  "Дегустируем ингредиенты...",
  "Учимся у Рамзи...",
  "Изучаем блюда от шефа...",
  "Пересматриваем Рататуя...",
  "Настраиваем камеру...",
  "Регулируем освещение...",
  "Протираем бокалы...",
  "Встречаем посетителей...",
];

function showRandomLine() {
  line.value = lines[Math.floor(Math.random() * lines.length)];
}

onMounted(() => {
  showRandomLine();
  setInterval(showRandomLine, 5000);
});
</script>

<template>
  <div class="loading page">
    <video class="loading__bg" :src="`images/bg-${activeTheme}.mp4`" autoplay disablepictureinpicture loop muted playsinline></video>
    <div class="loading__indicator">
      <svg class="loading__fill">
        <path d="M55.5 0C75.5691 1.4447 82.9001 13.7079 103 14.1768 123.995 14.6666 131.223-3.7456 152 0c15.606 2.8135 23.066 12.1809 38.5 16.1769C214.612 22.4196 221.425-2.2137 246 0c20.406 1.8382 28.042 14.5757 48.5 14.1768C314.245 13.7918 320.259-.6322 340 0c18.682.5984 24.828 9.2144 43.5 10.1768C403.943 11.2306 410.5 0 431 0s40 25.8254 40 25.8254V209.6769H0V25.8254S32.3658-1.6652 55.5 0Z" fill="url(#loadingBack)"/>
        <defs>
          <linearGradient id="loadingBack" x1="0" y1="0" x2="0" y2="100%">
            <stop stop-color="var(--theme-active-light)" offset="0"/>
            <stop stop-color="var(--theme-active)" offset="1"/>
          </linearGradient>
        </defs>
      </svg>
      <svg class="loading__fill">
        <path d="M55.5 0C75.5691 1.4447 82.9001 13.7079 103 14.1768 123.995 14.6666 131.223-3.7456 152 0c15.606 2.8135 23.066 12.1809 38.5 16.1769C214.612 22.4196 221.425-2.2137 246 0c20.406 1.8382 28.042 14.5757 48.5 14.1768C314.245 13.7918 320.259-.6322 340 0c18.682.5984 24.828 9.2144 43.5 10.1768C403.943 11.2306 410.5 0 431 0s40 25.8254 40 25.8254V209.6769H0V25.8254S32.3658-1.6652 55.5 0Z" fill="url(#loadingFront)"/>
        <defs>
          <linearGradient id="loadingFront" x1="0" y1="0" x2="0" y2="100%">
            <stop stop-color="var(--theme-main-light)" offset="0"/>
            <stop stop-color="var(--theme-main)" offset="1"/>
          </linearGradient>
        </defs>
      </svg>
      <img class="loading__logo" src="/images/logo.svg?v=1">
    </div>
    <div class="loading__text">{{ line }}</div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: grid;
  gap: 30px;
  align-content: center;
  justify-items: center;

  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  &__indicator {
    position: relative;
    width: 160px;
    height: 160px;
    background: #333333;
    border-radius: 24px;
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
    overflow: hidden;
  }

  &__fill {
    position: absolute;
    width: 480px;
    height: 200px;
    animation: 3s ease-out forwards;

    &:nth-of-type(1) {
      animation-name: fill-back;
    }

    &:nth-of-type(2) {
      animation-name: fill-front;
    }
  }

  &__logo {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &__text {
    font-size: 18px;
    font-weight: 700;
  }
}

@keyframes fill-back {
  0% {
    translate: 10% 75%;
  }
  100% {
    translate: -60% -10%;
  }
}

@keyframes fill-front {
  0% {
    translate: -70% 85%;
  }
  100% {
    translate: 0% -10%;
  }
}
</style>
