<script setup>
import NavButton from './NavButton.vue'

defineProps({
  activeItem: Number
});

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
          <path
            v-for="(n, i) in 5"
            :class="['cutout-path', { active: activeItem == i }]"
            d="M-58 0C-40.6337 0-34.2112 9.2942-27.8927 18.4377-21.7759 27.2894-15.7566 36 0 36 15.7566 36 21.7759 27.2894 27.8927 18.4377 34.2112 9.2942 40.6337 0 58 0Z"
            fill="white" />
        </mask>
      </svg>
    </div>
    <div class="navbar__buttons">
      <div class="navbar__circle"></div>
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
  opacity: 0;
  transition: opacity 0.4s;

  &.active {
    opacity: 1;
  }

  @for $n from 1 through 5 {
    &:nth-child(#{$n}) {
      translate: calc(50% + ($n - 3) * var(--button-width));
    }
  }
}

.navbar {
  --active-item: v-bind('activeItem');
  --button-width: 70px;
  --bounce: all 0.8s cubic-bezier(0.439, 1.477, 0.163, 0.875);
  --translate: calc((var(--active-item) - 2) * var(--button-width));
  position: relative;
  filter: drop-shadow(0 2px 4px var(--theme-drop-shadow));
  height: 71px;

  &__bg {
    position: absolute;
    inset: 0;
    background: var(--theme-98);
    mask-image: linear-gradient(white, white), url(#mask);
    mask-composite: subtract;
  }

  &__buttons {
    position: relative;
    display: flex;
    height: 100%;
    justify-content: center;
  }

  &__circle {
    position: absolute;
    top: 0;
    width: 46px;
    height: 46px;
    background: var(--theme-main-gradient);
    border-radius: 50%;
    translate: var(--translate) -50%;
    transition: var(--bounce);
  }

  &__button {
    width: var(--button-width);
  }
}
</style>
