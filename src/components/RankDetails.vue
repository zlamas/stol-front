<script setup>
import { computed, onMounted, useTemplateRef, watch } from 'vue';
import useEventBus from '@/eventBus';
import { formatCurrency } from '@/funcs';
import SVGIcon from '@/components/SVGIcon.vue';

const props = defineProps({
  id: [Number, String],
  name: String,
  multiplier: String,
  tasks: Object,
  rank: Object,
});

const { emit, bus } = useEventBus();

const taskElem = useTemplateRef('tasks');
const rootElem = useTemplateRef('root');

const expandedRank = defineModel();
const state = computed(() => {
  if (props.id < props.rank.current_id) return 'complete';
  if (props.id == props.rank.current_id) return 'current';
  if (props.id == props.rank.next_id) return 'next';
  return 'locked';
});
const expanded = computed(() => expandedRank.value == props.id)

onMounted(() => {
  rootElem.value.style.setProperty(
    '--expand-padding',
    `${taskElem.value.offsetHeight - 98}px`
  );
});

watch(
  () => bus.value.get('tutorialEvent'),
  ([step]) => {
    if (props.id != 2) return;
    if (step == 6) {
      expandedRank.value = null;
    } else if (step == 7) {
      expandedRank.value = 2;
    }
  }
);

function isTaskDone(type, value) {
  if (state.value == 'complete' || state.value == 'current') return true;
  if (state.value == 'locked') return false;
  return ({
    enter: true,
    scans: props.rank.progress_current.scans >= value,
    sum: props.rank.progress_current.sum_spent >= value,
    streak: props.rank.progress_current.streak_days >= value,
  }[type]);
}

function getTaskDescription(type, value) {
  if (state.value == 'locked') return '???';
  return ({
    enter: 'Зайти в приложение',
    scans: `Отсканировать ${value} чеков`,
    sum: `Загрузить чеков на ${formatCurrency(value)}`,
    streak: `Заходить в приложение ${value} дней подряд`,
  }[type]);
}
</script>

<template>
  <div ref="root" :class="['rank', state, { expanded }]">
    <div
      class="rank__content"
      :class="{ 'tutorial-6': id == 2, 'tutorial-7': id == 2 }"
      @click="emit('tutorialStep')"
    >
      <div ref="tasks" class="rank__tasks">
        <div
          v-for="(value, type) in tasks"
          :key="type"
          class="rank__task"
        >
          <div class="rank__checkbox">
            <SVGIcon v-if="isTaskDone(type, value)" name="task-check" />
          </div>
          <div>{{ getTaskDescription(type, value) }}</div>
        </div>
      </div>
      <div class="rank__block" @click="expandedRank = (expanded ? null : id)">
        <div class="rank__row">
          <div class="rank__number">
            <SVGIcon v-if="state == 'complete'" name="complete" />
            <div v-else>{{ id }}</div>
          </div>
          <div class="rank__multiplier gradient-border">
            <SVGIcon name="points-multi" />
            <span>x{{ multiplier }}</span>
          </div>
        </div>
        <div class="rank__name">
          <span>{{ name }}</span>
          <SVGIcon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  display: grid;
  gap: 12px;
  color: var(--main-color);

  &.complete {
    --main-color: #74B68E;
    --multiplier-color: var(--main-color);
    --circle-color: var(--main-color);
    --number-color: var(--main-color);
    --arrow-color: var(--main-color);
    --points-color: var(--multiplier-color);
    --bg-color: #DDF1E7;
    --task-color: var(--main-color);
    --line-color: #74B68EC0;
    --shadow-color: #D987A240;
  }

  &.current {
    --main-color: var(--theme-main-gradient);
    --multiplier-color: var(--main-color);
    --circle-color: var(--main-color);
    --number-color: #FFF;
    --arrow-color: url(#gradient-main);
    --points-color: url(#gradient-main);
    --bg-color: var(--theme-rank-bg-current);
    --task-color: var(--theme-rank-task-current);
    --line-color: var(--theme-rank-line);
    --shadow-color: #BF3C6740;

    span {
      background: var(--main-color);
      background-clip: text;
      color: transparent;
    }
  }

  &.next {
    --main-color: var(--theme-rank-main);
    --multiplier-color: var(--theme-rank-multiplier);
    --circle-color: var(--theme-rank-circle);
    --number-color: var(--main-color);
    --arrow-color: var(--main-color);
    --points-color: var(--multiplier-color);
    --bg-color: var(--theme-rank-bg-next);
    --task-color: var(--theme-rank-task-next);
    --line-color: #A2909680;
    --shadow-color: #D987A240;
  }

  &.locked {
    --main-color: #A29096;
    --multiplier-color: var(--main-color);
    --circle-color: #EAE6E6;
    --number-color: var(--main-color);
    --arrow-color: var(--main-color);
    --points-color: var(--multiplier-color);
    --bg-color: #F4F0F0;
    --task-color: #B9ACB0;
    --line-color: #A2909680;
    --shadow-color: #4D4D4D40;
  }

  &:not(:last-child)::after {
    content: "";
    display: block;
    height: 32px;
    border-left: 4px dotted var(--line-color);
    margin: auto;
  }

  &__content {
    position: relative;
    background: #FFF;
    border-radius: 16px;
  }

  &__block {
    position: relative;
    display: grid;
    gap: 5px;
    justify-items: center;
    padding: 0 12px;
    transition: padding 0.3s ease-out;
    translate: 0;

    .expanded & {
      padding-top: 16px;
      padding-bottom: var(--expand-padding);
    }

    .locked:not(.expanded) & {
      opacity: 0.5;
    }

    .complete:not(.expanded) & {
      opacity: 0.75;
    }
  }

  &__row {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 61px;
    height: 61px;
    border-radius: 50%;
    background: var(--circle-color);
    color: var(--number-color);
    font-size: 28px;
  }

  &__multiplier {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    gap: 2px;
    border-radius: 9px;
    background-color: #FFF;
    box-shadow: 0 2px 4px var(--shadow-color);
    color: var(--multiplier-color);
    font-size: 14px;
    padding: 10px 12px;

    &::before {
      background: var(--multiplier-color);
    }
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      transition: rotate 0.3s linear;

      .expanded & {
        rotate: 180deg;
      }
    }
  }

  &__tasks {
    display: grid;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    gap: 12px;
    background: var(--bg-color);
    border-radius: 16px;
    color: var(--task-color);
    font-size: 14px;
    padding: 120px 12px 16px;
    translate: -100vw 0;
    transition: translate 0.3s ease-out;

    .expanded & {
      translate: 0;
    }
  }

  &__task {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  &__checkbox {
    display: flex;
    width: 16px;
    height: 16px;
    border: 2px solid;
    border-radius: 4px;

    svg {
      margin: auto;
    }
  }
}
</style>
