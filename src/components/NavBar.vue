<script setup>
import useEventBus from '@/eventBus';
import SVGIcon from '@/components/SVGIcon.vue';

defineProps({
  activeIndex: Number,
});

const { emit } = useEventBus();

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
      <svg width="100%">
        <mask id="navbarMask">
          <path
            v-for="(n, i) in 5"
            :key="n"
            :class="['navbar__cutout', { active: activeIndex == i }]"
            d="M-58 0C-40.6337 0-34.2112 9.2942-27.8927 18.4377-21.7759 27.2894-15.7566 36 0 36 15.7566 36 21.7759 27.2894 27.8927 18.4377 34.2112 9.2942 40.6337 0 58 0Z"
            fill="white"
          />
        </mask>
      </svg>
    </div>
    <div class="navbar__buttons">
      <div class="navbar__circle"></div>
      <button
        v-for="(label, view, i) in labels"
        :key="view"
        :class="['navbar__button', { active: activeIndex == i }]"
        @click="emit('currentView', view)"
      >
        <SVGIcon
          :name="view"
          size="24"
        />
        <span class="navbar__button-label gradient-text">{{ label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  --active-index: v-bind('activeIndex');
  --button-width: 70px;
  --translate: calc((var(--active-index) - 2) * var(--button-width));
  position: relative;
  height: var(--navbar-height);
  filter: drop-shadow(0 2px 4px var(--theme-drop-shadow));

  &__bg {
    position: absolute;
    inset: 0;
    background: var(--theme-98);
    mask-image: linear-gradient(white, white), url(#navbarMask);
    mask-composite: subtract;
  }

  &__cutout {
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

  &__buttons {
    display: flex;
    position: relative;
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
    transition: all 0.8s var(--bounce);
  }

  &__button {
    display: flex;
    position: relative;
    width: var(--button-width);
    justify-content: center;
    align-items: center;
    color: var(--theme-neutral);
    transition: all 0.8s var(--bounce);

    &.active {
      translate: 0 -50%;
      color: var(--theme-98);
    }

    &-label {
      position: absolute;
      top: 100%;
      font-size: 12px;
      font-weight: 700;
      margin-top: 10px;
    }
  }
}
</style>
