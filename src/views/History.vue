<script setup>
import HistoryItem from '@/components/HistoryItem.vue'
import historyData from '@/history.json'
</script>

<template>
  <div class="content">
    <div class="h2">История посещений</div>
    <div class="separator"></div>
    <div class="history-items scrollable">
      <HistoryItem v-for="data of historyData" v-bind="data" />
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
.content--history {
  --side-padding: 20px;
  display: flex;
  flex-flow: column;
  gap: 16px;
  padding: 20px var(--side-padding);
}
</style>
