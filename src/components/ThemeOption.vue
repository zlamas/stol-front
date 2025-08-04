<script setup>
import SVGIcon from '@/components/SVGIcon.vue';

defineProps({
  id: String,
  valid: Boolean,
});
</script>

<template>
  <div :class="['theme-option', 'button-animated', id]">
    <svg v-if="valid" class="theme-option__icon" viewBox="0 0 48 48">
      <path d="M24.0001.0001C17.6349.0001 11.53 2.5305 7.0293 7.0314 2.5284 11.5323 0 17.6345 0 24.0002 0 30.1011 2.3225 35.963 6.4787 40.4025l-.0076.0076.5565.5565c.001.0009.003.001.0038.002l.5585.5605.0076-.0076c4.4395 4.1562 10.3012 6.4787 16.4023 6.4787 6.3652 0 12.47-2.5284 16.9708-7.0293C45.4715 36.4701 48 30.3658 48 24.0002c0-6.1009-2.3225-11.9608-6.4787-16.4003l.0076-.0076-.5605-.5605-.5585-.5585-.0076.0076C35.963 2.3245 30.1011 0 24 0Zm-.002 1.5339c5.9586 0 11.6749 2.3689 15.8877 6.5825L8.1104 39.8898c-4.2136-4.2137-6.5805-9.9292-6.5805-15.8877 0-5.9586 2.3668-11.6719 6.5805-15.8857C12.324 3.9029 18.0395 1.534 23.9981 1.534Z" :fill="`url(#gradient-${id})`"/>
      <defs>
        <linearGradient :id="`gradient-${id}`" x1="24" x2="24" y1=".5" y2="47.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="var(--theme-main-light)" offset="0"/>
          <stop stop-color="var(--theme-main)" offset="1"/>
        </linearGradient>
      </defs>
    </svg>
    <template v-else>
      <SVGIcon name="no-theme" class="theme-option__icon" />
      <div class="theme-option__glare"></div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.theme-option {
  --shadow-active: inset 0 2px 4px 4px var(--theme-drop-shadow);
  position: relative;
  background: var(--theme-bg);
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  &__icon {
    width: var(--option-size);
    height: var(--option-size);
  }

  &__glare {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(70deg, transparent 30%, white 50%, transparent 70%)
      -40px
      no-repeat;
    animation: glare 0.2s linear;

    &:active {
      animation: none;
    }
  }
}

@keyframes glare {
  from { background-position-x: -40px; }
  to { background-position-x: 40px; }
}
</style>
