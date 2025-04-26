<script setup>
import Icon from './Icon.vue'

defineProps({
  icon: String,
  label: String,
});

</script>

<template>
  <button class="navbar__button">
    <Icon :name="icon" size=24 />
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
    stroke: var(--pink);
    fill: var(--pink);
    transition: var(--bounce);

    &.active {
      translate: 0 -50%;
      stroke: #FFF;
      fill: #FFF;
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
