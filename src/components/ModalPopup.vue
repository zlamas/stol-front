<script setup>
import { ref, computed, useTemplateRef, watch } from 'vue';
import useEventBus from '@/eventBus';
import SVGIcon from '@/components/SVGIcon.vue';

const props = defineProps({
  name: String,
  type: String,
  direction: String,
  classes: Object,
});

const { emit, bus } = useEventBus();

const show = computed(() => bus.value.get('currentModal') == props.name);

watch(
  () => show.value,
  (show) => { if (show) dragAmount.value = 0; }
);

const container = useTemplateRef('container');

const dragging = ref(false);
const dragAmount = ref(0);
let dragSpeed = null;
let startY = null;
let previousY = null;

function onPointerDown(event) {
  if (event.target == container.value) {
    dragging.value = true;
    startY = previousY = event.clientY;
  }
}

function onPointerMove(event) {
  if (dragging.value) {
    dragSpeed = event.clientY - previousY;
    previousY = event.clientY;
    dragAmount.value =
      Math.max(event.clientY - startY, 0) / event.target.offsetHeight;
  }
}

function onPointerUp() {
  if (dragAmount.value > 0.5 || dragSpeed > 20) {
    emit('currentModal', null);
  } else {
    dragAmount.value = 0;
  }
  dragging.value = false;
}
</script>

<template>
  <Teleport to=".app">
    <Transition name="fade">
      <div
        v-show="show"
        :class="['modal-overlay', { dragging }]"
        @click="emit('currentModal', null)"
      ></div>
    </Transition>
    <Transition :name="`slide-${direction}`">
      <div v-if="show" :class="['modal', type, name, classes]">
        <button v-if="type == 'modal'" class="modal__close">
          <SVGIcon name="close" size="14" />
        </button>
        <div
          ref="container"
          :class="['modal__container', { dragging }]"
          v-on="type == 'slideout' ? {
            pointerdown: onPointerDown,
            pointermove: onPointerMove,
            pointerup: onPointerUp,
          } : {}"
        >
          <slot name="background" />
          <div class="modal__content">
            <SVGIcon
              v-if="type == 'popup'"
              name="close"
              size="44"
              class="popup__close"
              @click="emit('currentModal', null)"
            />
            <slot name="body" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(2px);

  &.dragging {
    opacity: v-bind('`${1 - dragAmount}`');
  }

  &:not(.dragging) {
    transition-duration: 0.3s;
  }
}

.modal {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 16px;
  padding: 24px;
  pointer-events: none;
  touch-action: none;

  &__container {
    position: relative;
    width: 100%;
    background: var(--theme-98);
    border-radius: 24px;
    box-shadow: 0 4px 8px var(--theme-drop-shadow);
    overflow: hidden;
    pointer-events: auto;

    &.dragging {
      translate: 0 v-bind('`${dragAmount * 100}%`');
    }

    &:not(.dragging) {
      transition-duration: 0.3s;
    }
  }

  &__content {
    position: relative;
    height: 100%;
    align-content: start;
    border-radius: inherit;
    padding: 16px;
    overflow: auto;
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
}
</style>
