<script setup>
import { computed, ref } from 'vue'

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

const progress = computed(() => {
  const resources = Object.values(data.value);
  return `${resources.filter((res) => res).length / resources.length * 100}%`;
});
</script>

<template>
  <div class="main">
    <div class="content loading">
      <video class="loading__bg" src="/images/background.mp4" autoplay disablepictureinpicture loop muted playsinline></video>
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
    background: var(--color-text);
    border-radius: 24px;
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);
    overflow: hidden;
  }

  &__bar {
    width: var(--loading-progress);
    height: 100%;
    background: var(--color-main-gradient);
    transition: width 0.5s;
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
</style>
