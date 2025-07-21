<script setup>
import { computed, ref, watch } from 'vue'
import useEventBus from '@/eventBus'
import Icon from './Icon.vue'

const props = defineProps({
  name: String,
  type: String,
  direction: String
});

const { emit, bus } = useEventBus();
const show = ref(false);

watch(
  () => bus.value.get('currentModal'),
  (val) => show.value = (val == props.name)
);
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="overlay" @click="emit('currentModal', null)"></div>
  </Transition>
  <Transition :name="`slide-${direction}`">
    <div v-if="show" :class="`modal ${type} ${name}`">
      <button v-if="type == 'modal'" class="modal__close">
        <Icon name="close" size=14 />
      </button>
      <div class="modal__container">
        <slot name="background" />
        <div class="modal__content">
          <Icon
            v-if="type == 'popup'"
            name="close"
            size=44
            class="popup__close"
            @click="emit('currentModal', null)" />
          <slot name="body" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(2px);
  z-index: 999;

  &.fade-enter-active,
  &.fade-leave-active {
    transition-duration: 0.3s;
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: translate 0.3s cubic-bezier(0.255, 0.520, 0.185, 1.200);
}

.slide-left-enter-from,
.slide-left-leave-to {
  translate: 100%;
}

.slide-right-enter-from,
.slide-right-leave-to {
  translate: -100%;
}

.slide-up-enter-from,
.slide-up-leave-to {
  translate: 0 100%;
}

.slide-down-enter-from,
.slide-down-leave-to {
  translate: 0 -100%;
}

.modal {
  position: fixed;
  inset: 0;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 16px;
  padding: 24px;
  z-index: 9999;
  pointer-events: none;

  &__container {
    position: relative;
    width: 100%;
    background: var(--theme-98);
    border-radius: 24px;
    box-shadow: 0 4px 8px var(--theme-drop-shadow);
    overflow: hidden;
    pointer-events: auto;
  }

  &__content {
    position: relative;
    height: 100%;
    padding: 16px;
    border-radius: inherit;
    overflow: auto;
    scrollbar-width: none;
  }

  &__close {
    width: 40px;
    height: 40px;
    justify-self: end;
    background: var(--theme-98);
    border-radius: 50%;
    box-shadow: 0 2px 4px var(--theme-drop-shadow);

    svg {
      margin: auto;
    }
  }
}

.popup {
  align-content: center;

  .modal__container {
    width: auto;
  }

  &__close {
    position: absolute;
    padding: 15px;
    top: 0;
    right: 0;
  }
}

.slideout {
  padding: 64px 0 0;
  align-content: stretch;

  .modal__container {
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: 24px 24px 0 0;

    &::before {
      content: "";
      display: block;
      width: 65px;
      height: 4px;
      border-radius: 9em;
      background: #A29096;
      margin: 12px auto;
    }
  }

  .modal__content {
    padding: 24px 0 0;
  }
}
</style>
