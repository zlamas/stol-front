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
  <button @click="goToHref" class="main-button" :disabled>
    <Icon v-if="icon" :name="icon" size=24 />
    <span class="gradient-text">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
.main-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 48px;
  background: #FFF;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgb(159 45 79 / 30%);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
