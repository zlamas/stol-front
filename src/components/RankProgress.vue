<script setup>
defineProps({
  rank: String,
  nextRank: String,
  rankProgress: String
});
</script>

<template>
  <div class="rank block">
    <div class="rank__names">
      <div class="rank__current gradient-text">{{ rank }}</div>
      <div class="rank__next">{{ nextRank }}</div>
    </div>
    <div class="rank__progress">
      <div class="rank__progress-bar" :style="{ '--progress': rankProgress }"></div>
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
