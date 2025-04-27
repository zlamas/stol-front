<script setup>
import { computed, ref } from 'vue'

defineProps({
  activeTheme: String,
});

const data = defineModel();
const line = ref(0);

const lines = [
  "Хвалим поваров...",
  "Договариваемся о брони...",
  "Дегустируем ингредиенты...",
  "Учимся у Рамзи...",
  "Изучаем блюда от шефа...",
  "Смотрим Обломова...",
  "Настраиваем камеру...",
  "Регулируем освещение...",
  "Протираем бокалы...",
  "Встречаем посетителей...",
];

setInterval(() => line.value = Math.floor(Math.random() * lines.length), 5000);
</script>

<template>
  <div :class="`main ${activeTheme}`">
    <div class="content loading">
      <video class="loading__bg" :src="`images/bg-${activeTheme}.mp4`" autoplay disablepictureinpicture loop muted playsinline></video>
      <div class="loading__content">
        <div class="loading__indicator">
          <div class="loading__bar" :style="{ width: progress }"></div>
          <img class="loading__logo" src="/images/logo.svg?v=1">
        </div>
        <div class="loading__text">{{ lines[line] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: grid;

  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    position: relative;
    display: grid;
    gap: 30px;
    justify-items: center;
    margin: auto;
  }

  &__indicator {
    position: relative;
    width: 180px;
    height: 180px;
    background: var(--black-20);
    border-radius: 24px;
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    background: var(--theme-main-gradient);
    animation: 3s ease-in-out loading;
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

@keyframes loading {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
