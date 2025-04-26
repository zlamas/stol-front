<script setup>
import { computed } from 'vue'
const props = defineProps({
  you: Boolean,
  position: Number,
  avatar: String,
  username: String,
  points: Number,
});

const formattedPoints = computed(() => props.points.toLocaleString('ru'));
</script>

<template>
  <div :class="['ratings__item', 'block', { you }]">
    <div class="ratings__item-content">
      <div class="ratings__place">{{ props.position <= 100 ? props.position : '100+' }}</div>
      <img class="ratings__avatar" :src="`${props.avatar || 'images/missing.svg'}`">
      <div class="ratings__name">{{ props.you ? 'You' : props.username }}</div>
      <div class="ratings__points count points gradient-text">{{ formattedPoints }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ratings {
  &__item {
    padding: 2px;

    &.you {
      box-shadow: 0 4px 8px rgba(195 43 99 / 30%);
      background: var(--color-main-gradient);
      font-weight: 700;
    }

    &-content {
      display: flex;
      align-items: center;
      background: #FFF;
      border-radius: 10px;
      padding: 6px 16px 6px 6px;
    }
  }

  &__place {
    width: 30px;
    font-weight: 700;
    text-align: center;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #DEDEDE;
    margin-left: 8px;
    margin-right: 12px;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
}
</style>
