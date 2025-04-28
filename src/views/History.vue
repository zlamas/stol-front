<script setup>
import { useFetch } from '@/fetch.js'
import HistoryItem from '@/components/HistoryItem.vue'
import Icon from '@/components/Icon.vue'

const data = defineModel();
</script>

<template>
  <div v-if="data.history.length">
    <div class="h2">История посещений</div>
    <Icon name="separator" class="separator" />
    <div class="history-items scrollable">
      <HistoryItem v-for="item of data.history" v-bind="item" />
    </div>
  </div>
  <div v-else>
    <div class="h2">История посещений</div>
    <div class="history__empty">
      <Icon name="alien" />
      <span>Вы еще не отсканировали ни одного чека. Пора скорее это исправить!</span>
    </div>
  </div>
</template>

<style lang="scss">
.history-items {
  display: grid;
  gap: 12px;
  align-content: start;
}
</style>

<style scoped lang="scss">
.view--history {
  --side-padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 16px;
  padding: 20px var(--side-padding);
}

.history {
  &__empty {
    display: grid;
    gap: 16px;
    justify-items: center;
    color: var(--theme-60);
    font-size: 16px;
    font-weight: 700;
    margin: auto;
    text-align: center;
  }
}
</style>
