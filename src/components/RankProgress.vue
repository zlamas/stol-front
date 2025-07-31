<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: String,
  current_id: [Number, String],
  conditions_current: Object,
  conditions_next: Object,
  progress_current: Object,
});

const progress = computed(() => {
  const progressValues = ['scans', 'sum_spent', 'streak_days']
    .map((prop) => {
      let value = props.progress_current[prop] /
        (props.conditions_next[prop] - (props.conditions_current[prop] || 0));
      return Math.min(value, 1);
    });

  const progressTotal = progressValues.reduce((a, b) => a + (b || 0));
  const progress = progressTotal / progressValues.filter((val) => !isNaN(val)).length;

  return progress;
});
</script>

<template>
  <div class="rank">
    <div class="rank__names">
      <div class="rank__current gradient-text">{{ current }}</div>
      <div class="rank__next">Ранг {{ current_id }}</div>
    </div>
    <div class="rank__progress">
      <div class="rank__progress-bar"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank {
  display: grid;
  gap: 6px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;

  &__names {
    display: flex;
    justify-content: space-between;
  }

  &__next {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--theme-85);
  }

  &__progress {
    background: var(--theme-92);
    border-radius: 7px;
    padding: 4px;

    &-bar {
      width: v-bind('`${progress}%`');
      height: 18px;
      min-width: 10px;
      background: var(--theme-main-gradient);
      border-radius: 6px;
      box-shadow: 0 1px 2px rgb(0 0 0 / 25%);
    }
  }
}
</style>
