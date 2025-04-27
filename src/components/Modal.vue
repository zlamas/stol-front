<script setup>
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal">
      <button class="modal__close" @click="$emit('close')"></button>
      <div class="modal__container">
        <slot name="background" />
        <div class="modal__content">
          <slot name="body" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  padding: 88px 20px;
  z-index: 99;

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--theme-modal);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    box-shadow: 0 4px 8px var(--theme-drop-shadow);
    overflow: hidden;
  }

  &__content {
    width: 100%;
    height: 100%;
    padding: 16px;
    overflow: auto;
    scrollbar-width: none;
  }

  &__close {
    position: absolute;
    right: 20px;
    top: 30px;
    width: 40px;
    height: 40px;
    background: var(--theme-modal) url(/images/close.svg) no-repeat center;
    backdrop-filter: blur(12px);
    border-radius: 50%;
    box-shadow: 0 2px 4px var(--theme-drop-shadow);
  }
}
</style>
