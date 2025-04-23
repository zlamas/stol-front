<script setup>
import NavButton from './NavButton.vue'

const currentView = defineModel();

function updateCurrentView(value) {
  currentView.value = value;
}

const labels = {
  rating: 'Рейтинг',
  offers: 'Офферы',
  main: 'Главная',
  history: 'История',
  profile: 'Профиль',
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar__bg">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%">
        <mask id="mask">
          <path class="cutout-path" d="M-58 0C-40.6337 0-34.2112 9.2942-27.8927 18.4377-21.7759 27.2894-15.7566 36 0 36 15.7566 36 21.7759 27.2894 27.8927 18.4377 34.2112 9.2942 40.6337 0 58 0Z" fill="white"/>
        </mask>
      </svg>
    </div>
    <div class="navbar__buttons">
      <NavButton
        v-for="(label, icon) of labels"
        @click="() => updateCurrentView(icon)"
        :class="{ active: currentView == icon }"
        :icon
        :label />
    </div>
  </nav>
</template>

<style scoped lang="scss">
.cutout-path {
  translate: calc(50% + (var(--active-item) - 2) * var(--button-width));
}

.navbar {
  --button-width: 70px;
  position: relative;
  filter: drop-shadow(0 4px 8px rgb(159 45 79 / 30%));
  height: 71px;

  &__bg {
    position: absolute;
    inset: 0;
    background: #FFF;
    mask-image: linear-gradient(white, white), url(#mask);
    mask-composite: subtract;
  }

  &__buttons {
    display: flex;
    height: 100%;
    justify-content: center;
  }

  &__button {
    width: var(--button-width);
  }
}
</style>
