<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import useEventBus from '@/eventBus';
import useFetch from '@/fetch';
import { wait } from '@/funcs';
import tutorial from '@/tutorial.json';

import SVGIcon from '@/components/SVGIcon.vue';

const userData = defineModel('userData');
const tutorialCompleted = defineModel('tutorialCompleted');

const props = defineProps({
  historyEmpty: Boolean,
});

const { emit, bus } = useEventBus();
const step = ref(0);
const skip = ref(false);
const completed = ref(tutorialCompleted.value);

const showText = ref(false);
const textTop = ref('auto');
const textBottom = ref('auto');

const text = computed(() => {
  let html = tutorial[step.value]
    .split('\n')
    .map((line) => `<p>${line}</p>`);

  if (step.value == 12 && !props.historyEmpty) {
    html = html.slice(0, -1);
  } else if (step.value == 19) {
    if (completed.value) {
      html.splice(1, 1);
    } else {
      html.splice(2, 0, `
        <div class="tutorial__points block gradient-border">
          <span class="count points gradient-text">10</span>
        </div>
      `);
    }
  }

  return html.join('');
});

const isEnd = computed(() => step.value == tutorial.length - 1);

function stepForward() {
  if (isEnd.value) {
    emit('setTutorial', false);
  } else {
    step.value += 1;
    if (isEnd.value && !tutorialCompleted.value) {
      completeTutorial();
    }
  }
}

function stepBack() {
  step.value -= 1;
}

function waitAndShowTextAt(timeout, position) {
  showText.value = false;
  return wait(timeout).then(() => {
    textTop.value = `${position.top}px`;
    textBottom.value = `${position.bottom}px`;
    showText.value = true;
  });
}

function completeTutorial() {
  useFetch('tutorial/complete', { method: 'POST' })
    .then(({ data, ok }) => {
      if (ok) {
        tutorialCompleted.value = true;
        userData.value.points += data.points;
      }
    });
}

function skipTutorial() {
  useFetch('tutorial/skip', { method: 'POST' })
    .then(() => {
      emit('setTutorial', false);
    });
}

onMounted(() => {
  if (bus.value.get('setTutorial') == 'repeat') {
    wait(500)
      .then(() => emit('currentView', 'main'))
      .then(() => wait(1000))
      .then(() => step.value = 1);
  } else {
    step.value = 1;
  }
});

watch(
  () => step.value,
  (step) => {
    if (step == 6 || step == 7) {
      emit('currentModal', 'progress');
    } else {
      emit('currentModal', null);
    }

    if (step == 10) {
      emit('currentView', 'rating');
    } else if (step == 11) {
      emit('currentView', 'offers');
    } else if (step == 12) {
      emit('currentView', 'history');
    } else if (step >= 13) {
      emit('currentView', 'profile');
    } else {
      emit('currentView', 'main');
    }

    if (step == 3) {
      window.location.hash = '/scan';
    } else if (step == 4) {
      window.location.hash = '/review';
    } else {
      window.location.hash = '/';
    }

    switch (step) {
      case 1:
        waitAndShowTextAt(0, { top: 225 });
        break;
      case 2:
        waitAndShowTextAt(0, { top: 225 });
        break;
      case 3:
        waitAndShowTextAt(1500, { top: 225 });
        break;
      case 4:
        waitAndShowTextAt(1500, { top: 355 });
        break;
      case 5:
        waitAndShowTextAt(1500, { top: 225 });
        break;
      case 6:
        waitAndShowTextAt(1000, { top: 32 });
        break;
      case 7:
        waitAndShowTextAt(1000, { top: 73 });
        break;
      case 8:
        waitAndShowTextAt(1000, { top: 355 });
        break;
      case 9:
        waitAndShowTextAt(1000, { top: 129 });
        break;
      case 10: {
        const ratings = document.querySelector('.ratings').parentNode;
        waitAndShowTextAt(1500, { top: 40 })
          .then(() => ratings.scrollTop = ratings.scrollHeight);
        break;
      }
      case 11: {
        const offers = document.querySelector('.offers').parentNode;
        waitAndShowTextAt(1500, { top: 40 })
          .then(() => offers.scrollTop = offers.scrollHeight);
        break;
      }
      case 12:
        waitAndShowTextAt(1500, { top: 40 });
        break;
      case 13:
        waitAndShowTextAt(1500, { top: 168 });
        break;
      case 14:
        waitAndShowTextAt(1000, { top: 297 });
        break;
      case 15:
        waitAndShowTextAt(1000, { top: 418 });
        break;
      case 16:
        waitAndShowTextAt(1000, { top: 227 });
        break;
      case 17: {
        const profile = document.querySelector('.view--profile');
        profile.scrollTop = profile.scrollHeight;
        waitAndShowTextAt(1000, { top: 194 });
        break;
      }
      case 18:
        waitAndShowTextAt(1000, { top: 325 });
        break;
      case 19:
        waitAndShowTextAt(1000, { bottom: 275 });
        break;
    }

    emit('tutorialEvent', step);
  }
);

watch(
  [() => step.value, () => showText.value, () => skip.value],
  ([step, text, skip]) => {
    document.querySelectorAll('.highlight')
      .forEach((el) => el.classList.remove('highlight'));

    if (text && !skip) {
      wait(20).then(() => {
        document.querySelectorAll(`.tutorial-${step}`)
          .forEach((el) => el.classList.add('highlight'));
      });
    }
  }
)

watch(
  () => bus.value.get('tutorialStep'),
  stepForward
);
</script>

<template>
  <div>
    <div :class="['tutorial-overlay', { show: showText }]"></div>
    <div :class="['tutorial', { skip }]" v-if="!isEnd">
      <Transition name="tutorial-slide">
        <div
          v-if="showText && !skip"
          :key="step"
          class="tutorial__message"
        >
          <button class="tutorial__skip" @click="skip = true">
            <span>Пропустить</span>
            <SVGIcon name="skip" />
          </button>
          <div class="tutorial__content" v-html="text"></div>
          <div class="tutorial__buttons">
            <button
              v-if="step > 1"
              class="tutorial__button"
              @click="stepBack"
            >Назад</button>
            <button
              class="tutorial__button tutorial__button--next"
              @click="stepForward"
            >{{ step == 1 ? 'Поехали!' : 'Далее' }}</button>
          </div>
        </div>
      </Transition>

      <Transition name="tutorial-slide">
        <div v-if="skip" class="tutorial__message tutorial__message--skip">
          <div class="tutorial__content">
            <h2>Пропустить</h2>
            <p>Ты правда хочешь пропустить обучение?</p>
            <img class="tutorial__skip-image" src="/images/tutorial-skip.png">
          </div>
          <div class="tutorial__buttons">
            <button
              class="tutorial__button"
              @click="skipTutorial"
            >Да</button>
            <button
              class="tutorial__button tutorial__button--next"
              @click="skip = false"
            >Нет</button>
          </div>
        </div>
      </Transition>

      <Transition name="tutorial-slide">
        <img
          v-if="step == 1 && !skip"
          class="tutorial__donut-hello"
          src="/images/donut.png"
        >
      </Transition>

      <Transition name="fade">
        <div
          v-if="step == 1 && !skip"
          class="tutorial__donut-shadow"
        ></div>
      </Transition>
    </div>

    <div v-else class="tutorial tutorial--end">
      <Transition name="tutorial-slide">
        <div v-if="showText" class="tutorial__message">
          <div class="tutorial__content" v-html="text"></div>
          <div class="tutorial__buttons">
            <button
              class="tutorial__button"
              @click="stepBack"
            >Назад</button>
            <button
              class="tutorial__button tutorial__button--next"
              @click="stepForward"
            >Далее</button>
          </div>
        </div>
      </Transition>

      <Transition name="tutorial-slide">
        <img
          v-if="showText"
          class="tutorial__donut-heart"
          src="/images/donut-heart.png"
        >
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.tutorial-active {
  .highlight {
    position: relative;
    z-index: 200;

    &.tutorial-2 {
      animation: fade-in 0.3s forwards;
    }
  }
}

@keyframes fade-in {
  from {
    filter: brightness(0.3);
  }
  to {
    filter: none;
  }
}

.tutorial {
  &__points {
    border-radius: 10px;
    font-size: 17px;
    justify-self: center;
    margin: 4px 0;
    padding: 10px 16px;
  }
}
</style>

<style scoped lang="scss">
.tutorial-slide-leave-to {
  opacity: 0;
}

.tutorial-slide-enter-active,
.tutorial-slide-leave-active {
  transition: opacity 0.3s linear, translate 0.5s cubic-bezier(0, 1, 1, 1);
}

.tutorial-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 70%);
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s;

  &.show {
    opacity: 1;
  }
}

.tutorial {
  display: flex;
  position: fixed;
  inset: 0;
  align-items: flex-end;
  flex-flow: column;
  padding: 0 24px;
  pointer-events: none;
  z-index: 999;

  &--end {
    align-items: center;
  }

  &__message {
    display: grid;
    position: absolute;
    top: v-bind(textTop);
    bottom: v-bind(textBottom);
    gap: 12px;
    width: 258px;
    background: #FFF;
    border-radius: 20px;
    color: #333;
    font-size: 14px;
    line-height: 1.1;
    padding: 12px 16px;
    pointer-events: auto;
    z-index: 99;

    &.tutorial-slide-enter-from {
      translate: 100% -100%;
    }

    .skip &.tutorial-slide-leave-to {
      translate: 120% 0;
      opacity: 1;
    }

    &--skip {
      position: static;
      margin: auto;
      text-align: center;

      h2 {
        font-size: 18px;
        font-weight: 700;
      }

      img {
        width: 48px;
        height: 48px;
        margin: auto;
      }

      &.tutorial-slide-enter-from {
        translate: -150% -150%;
      }

      &.tutorial-slide-leave-to {
        translate: -150% 0;
        opacity: 1;
      }
    }
  }

  &__skip {
    display: flex;
    position: relative;
    gap: 4px;
    align-items: center;
    justify-self: end;
    color: #999;
    font-size: 12px;

    &::before {
      content: "";
      position: absolute;
      inset: -12px -16px;
    }
  }

  &__content {
    display: grid;
    gap: 9px;
    margin-bottom: 9px;
  }

  &__buttons {
    display: flex;
    gap: 8px;
  }

  &__button {
    border: 1px solid;
    border-radius: 12px;
    color: #B3B3B3;
    padding: 12px;
    flex: 1;

    &--next {
      background: var(--theme-main-gradient);
      border: 0;
      color: #FFF;
    }
  }

  &__donut {
    &-hello {
      position: absolute;
      top: 418px;
      left: 14px;
      width: 160px;
      z-index: 1;

      &.tutorial-slide-enter-from {
        translate: -100% -100%;
      }

      .skip & {
        &.tutorial-slide-enter-from,
        &.tutorial-slide-leave-to {
          translate: -120% 0;
          opacity: 1;
        }
      }
    }

    &-shadow {
      position: absolute;
      top: 548px;
      left: 42px;
      width: 93px;
      height: 13px;
      background: #917884;
      border-radius: 50%;
    }

    &-heart {
      position: absolute;
      bottom: 100px;
      width: 155px;
      height: 135px;

      &.tutorial-slide-enter-from {
        translate: 0 200%;
      }
    }
  }
}
</style>
