<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: String,
  next: String,
  conditions_current: Object,
  conditions_next: Object,
  progress_current: Object,
});

const progress = computed(() => {
  const progressValues = ['scans', 'sum_spent', 'streak']
    .map((prop) => {
      let value = props.progress_current[prop] /
        (props.conditions_next[prop] - (props.conditions_current[prop] || 0));
      return Math.min(value, 1);
    });

  const progressTotal = progressValues.reduce((a, b) => (a || 0) + (b || 0));
  const progress = progressTotal / progressValues.filter((val) => !isNaN(val)).length;

  return `${progress * 100}%`;
});
</script>

<template>
  <div class="rank block">
    <div class="rank__names">
      <div class="rank__current gradient-text">{{ current }}</div>
      <div class="rank__next">{{ next }}</div>
    </div>
    <div class="rank__progress">
      <div class="rank__progress-bar" :style="{ '--progress': progress }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
  padding: 10px 16px 16px;

  &__names {
    display: flex;
    justify-content: space-between;
  }

  &__next {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #CCC;

    &::before {
      content: url(/images/lock.svg);
      line-height: 0;
    }
  }

  &__progress {
    background: #F2F2F2;
    border-radius: 6px;
    padding: 4px;

    &-bar {
      width: var(--progress);
      height: 18px;
      background: var(--color-main-gradient);
      border-radius: 5px;
      box-shadow: 0 1px 2px rgb(0 0 0 / 25%);
    }
  }
}
</style>
