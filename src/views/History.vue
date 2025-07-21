<script setup>
import HistoryItem from '@/components/HistoryItem.vue'
import Icon from '@/components/Icon.vue'
import UserInfo from '@/components/UserInfo.vue'

const data = defineModel('data');
</script>

<template>
  <div>
    <UserInfo
      v-bind="data.user"
      v-model="data.notifications" />
    <template v-if="data.history.length">
      <div class="history__title h2">Сканирования</div>
      <div class="scrollable">
        <div class="history-items">
          <HistoryItem v-for="item of data.history" v-bind="item" />
        </div>
      </div>
    </template>
    <template v-else class="history__empty">
      <img class="history__empty-icon" src="/images/history-empty.png">
      <span>Вы еще ничего не отсканировали.<br>Пора скорее это исправить!</span>
    </template>
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
  --side-padding: 24px;
  display: flex;
  flex-flow: column;
  padding: 24px var(--side-padding);
}

.history {
  &__title {
    color: #000;
    text-align: left;
    margin-top: 30px;
  }

  &__empty {
    display: grid;
    gap: 6px;
    justify-items: center;
    color: var(--theme-30);
    font-size: 16px;
    font-weight: 700;
    margin: auto;
    text-align: center;

    &-icon {
      width: 191px;
    }
  }
}
</style>
