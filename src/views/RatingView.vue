<script setup>
import { ref } from 'vue'
import Top3RatingItem from '@/components/Top3RatingItem.vue'
import RatingItem from '@/components/RatingItem.vue'

const view = ref();

defineExpose({ view });

const data = defineModel('data');
</script>

<template>
  <div ref="view">
    <div class="top3 block">
      <h2 class="h2">Амбассадоры вкуса</h2>
      <div class="top3__users">
        <Top3RatingItem
          v-for="user in data.rating.leaders.slice(0, 3)"
          :key="user.username"
          v-bind="user" />
      </div>
    </div>
    <div class="scrollable">
      <div class="ratings">
        <RatingItem
          v-for="user in data.rating.leaders.slice(3)"
          :key="user.username"
          v-bind="user" />
      </div>
    </div>
    <RatingItem you v-bind="data.rating.user" />
  </div>
</template>

<style scoped lang="scss">
.view--rating {
  --side-padding: 24px;
  display: grid;
  gap: 16px;
  grid-template-rows: auto 1fr;
  padding: 0 var(--side-padding) 48px;
}

.top3 {
  display: grid;
  gap: 30px;
  padding: 20px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 4px 8px var(--theme-drop-shadow);
  margin: 0 calc(-1 * var(--side-padding));
  text-align: center;

  &__users {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
    align-items: end;
  }
}

.ratings {
  display: grid;
  gap: 8px;
  grid-template-columns: 100%;
  align-content: start;
}
</style>
