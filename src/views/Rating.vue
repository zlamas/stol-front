<script setup>
import { useFetch } from '@/fetch.js'
import Top3RatingItem from '@/components/Top3RatingItem.vue'
import RatingItem from '@/components/RatingItem.vue'

const data = defineModel();
</script>

<template>
  <div>
    <div class="top3 block">
      <h2 class="h2">Амбассадоры вкуса</h2>
      <div class="top3__users">
        <Top3RatingItem class="silver" v-bind="data.rating.leaders[1]" />
        <Top3RatingItem class="gold" v-bind="data.rating.leaders[0]" />
        <Top3RatingItem class="bronze" v-bind="data.rating.leaders[2]" />
      </div>
    </div>
    <div class="ratings scrollable">
      <RatingItem
        v-for="data of data.rating.leaders.slice(3)"
        v-bind="data" />
    </div>
    <RatingItem you v-bind="data.rating.user" />
  </div>
</template>

<style scoped lang="scss">
.view--rating {
  --side-padding: 24px;
  display: flex;
  flex-flow: column;
  padding: 0 var(--side-padding) 48px;
}

.top3 {
  margin: 0 calc(-1 * var(--side-padding));
  display: grid;
  gap: 30px;
  padding: 20px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 4px 8px var(--theme-drop-shadow);
  text-align: center;
  margin-bottom: 16px;

  &__users {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    justify-content: space-around;
  }
}

.ratings {
  display: grid;
  gap: 8px;
  grid-template-columns: 100%;
  align-content: start;
  margin-bottom: 12px;
  flex: 1;
}
</style>
