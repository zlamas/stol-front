<script setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps({
  level: [Number, String],
  name: String,
  multiplier: String,
  tasks: Array,
  currentLevel: Number,
});

const taskElem = useTemplateRef('tasks');
const rootElem = useTemplateRef('root');

const expandedLevel = defineModel();
const state = computed(() => {
  if (props.level < props.currentLevel) return 'complete';
  else if (props.level == props.currentLevel) return 'current';
  else if (props.level == props.currentLevel+ 1) return 'next';
  else return 'locked';
});
const expanded = computed(() => expandedLevel.value == props.level)

onMounted(() => {
  rootElem.value.style.setProperty(
    '--expand-padding',
    `${taskElem.value.offsetHeight - 98}px`
  );
});
</script>

<template>
  <div ref="root" :class="['level', state, { expanded }]">
    <div ref="tasks" class="level__tasks">
      <div v-for="task of tasks" class="level__task">
        <div class="level__checkbox">
          <Icon v-if="state == 'complete' || state == 'current' || task.done" name="task-check" />
        </div>
        <div>{{ state != 'locked' ? task.description : '???' }}</div>
      </div>
    </div>
    <div class="level__block" @click="expandedLevel = (expandedLevel == level) ? null : level">
      <div class="level__row">
        <div class="level__number">
          <Icon v-if="state == 'complete'" name="complete" />
          <div v-else>{{ level }}</div>
        </div>
        <div class="level__multiplier gradient-border">
          <Icon name="points-multi" />
          <span>x{{ multiplier }}</span>
        </div>
      </div>
      <div class="level__name">
        <span>{{ name }}</span>
        <Icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.level {
  position: relative;
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
    --bg-color: #FAE1EB;
    --task-color: #D85A93;
    --line-color: #E5AEC0;
    --shadow-color: #BF3C6740;

    span {
      background: var(--main-color);
      background-clip: text;
      color: transparent;
    }
  }

  &.next {
    --main-color: #CE6487;
    --multiplier-color: #DC8FA8;
    --circle-color: #F4DCE4;
    --number-color: var(--main-color);
    --arrow-color: var(--main-color);
    --points-color: var(--multiplier-color);
    --bg-color: #FCEEF3;
    --task-color: #7A525F;
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

  &__block {
    position: relative;
    display: grid;
    gap: 5px;
    justify-items: center;
    padding: 0 12px;
    transition: all 0.3s ease-out;
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
