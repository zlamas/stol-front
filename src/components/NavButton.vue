<script setup>
import Icon from './Icon.vue'

defineProps({
  icon: String,
  label: String,
});

</script>

<template>
  <button class="navbar__button">
    <span class="navbar__button-icon">
      <Icon :name="icon" size=24 />
    </span>
    <span class="navbar__button-label gradient-text">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.navbar {
  &__button {
    display: flex;
    position: relative;
    width: var(--button-width);
    justify-content: center;
    align-items: center;

    &.active {
      translate: 0 -35px;

      .navbar__button-icon {
        background: var(--color-main-gradient);
        stroke: #FFF;
        fill: #FFF;
      }
    }

    &-icon {
      padding: 10px;
      border-radius: 50%;
      stroke: var(--pink);
      fill: var(--pink)
    }

    &-label {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      font-size: 12px;
      font-weight: 700;
      margin-top: 10px;
    }
  }
}
</style>
