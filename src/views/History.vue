<script setup>
import { useFetch } from '@/fetch.js'
import HistoryItem from '@/components/HistoryItem.vue'
import Icon from '@/components/Icon.vue'

const history = (await useFetch('receipts/history')).data.data;
</script>

<template>
  <div>
    <div class="h2">История посещений</div>
    <Icon name="separator" class="separator" />
    <div class="history-items scrollable">
      <HistoryItem v-for="item of history" v-bind="item" />
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
</style>
