<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: Number,
  selected: Boolean,
  valid: Boolean,
})

const style = computed(() => ({
  '--gamma-bg': `var(--gamma${props.id}-bg)`,
  '--gamma-main': `var(--gamma${props.id}-main)`,
  '--gamma-main-light': `var(--gamma${props.id}-main-light)`,
  '--gamma-gradient': 'linear-gradient(var(--gamma-main-light), var(--gamma-main))'
}));
</script>

<template>
  <div :class="['gamma-option', { selected }]" :style>
    <svg v-if="valid" class="gamma-option__icon" fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="m40.617 7.383-0.54788-0.54781-9e-3 0.00902c-4.3469-4.0696-10.086-6.3442-16.06-6.3442-6.2326 0-12.21 2.4759-16.617 6.883-4.4071 4.4071-6.883 10.384-6.883 16.617 0 5.9738 2.2747 11.713 6.3443 16.06l-0.00902 0.0091 0.54495 0.54489c9.606e-4 9.29e-4 0.00191 2e-3 0.00286 0.0029l0.54781 0.54778 0.00903-9e-3c4.347 4.0696 10.086 6.3442 16.06 6.3442 6.2326 0 12.21-2.4759 16.617-6.883 4.407-4.4071 6.883-10.384 6.883-16.617 0-5.9738-2.2746-11.713-6.3442-16.06l9e-3 -0.00902z" :fill="`url(#gradient${id})`"/>
      <path d="m8.4437 39.556c-4.1258-4.1259-6.4437-9.7216-6.4437-15.556s2.3178-11.43 6.4436-15.556c4.1258-4.1258 9.7216-6.4436 15.556-6.4436s11.431 2.3178 15.556 6.4436l-31.113 31.113z" fill="var(--gamma-bg)"/>
      <defs>
        <linearGradient :id="`gradient${id}`" x1="24" x2="24" y1=".49995" y2="47.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="var(--gamma-main-light)" offset="0"/>
          <stop stop-color="var(--gamma-main)" offset="1"/>
        </linearGradient>
      </defs>
    </svg>
    <img v-else class="gamma-option__icon" src="/images/question.svg?v=2">
  </div>
</template>

<style scoped lang="scss">
.gamma-option {
  position: relative;
  filter: drop-shadow(0 2px 2px rgb(0 0 0 / 25%));

  &__icon {
    width: 48px;
    height: 48px;
  }

  &.selected {
    &::after {
      content: url(/images/selected.svg);
      position: absolute;
      width: 22px;
      height: 22px;
      bottom: -6px;
      right: -6px;
    }
  }
}
</style>
