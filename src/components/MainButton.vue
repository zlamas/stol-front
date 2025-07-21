<script setup>
import Icon from './Icon.vue'

const props = defineProps({
  icon: String,
  href: String,
  disabled: Boolean,
});

function goToHref() {
  if (props.href) {
    window.location.hash = props.href;
  }
}
</script>

<template>
  <button @click="goToHref" class="main-button button-animated block" :disabled>
    <Icon v-if="icon" :name="icon" size=24 />
    <span class="gradient-text">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.main-button {
  @include flex(6px, center);
  justify-content: center;
  width: 100%;
  height: 48px;
  box-shadow: 0 4px 8px var(--theme-drop-shadow);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;

  &:active {
    .gradient-text {
      --textGradient1: var(--theme-active-light);
      --textGradient2: var(--theme-active);
    }
  }
}
</style>
