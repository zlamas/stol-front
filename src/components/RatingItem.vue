<script setup>
import { computed } from 'vue';
const props = defineProps({
  you: Boolean,
  position: Number,
  avatar: String,
  username: String,
  points: Number,
});

const positionText = computed(() => props.position <= 100 ? props.position : '100+');
const usernameText = computed(() => props.you ? 'Вы' : props.username);
const formattedPoints = computed(() => props.points.toLocaleString('ru'));
</script>

<template>
  <div :class="['ratings__item', 'block', { 'gradient-border': you }]">
    <div class="ratings__place">{{ positionText }}</div>
    <img class="ratings__avatar" :src="props.avatar || 'images/avatar.png'">
    <div class="ratings__name">{{ usernameText }}</div>
    <div class="ratings__points count points gradient-text">{{ formattedPoints }}</div>
  </div>
</template>

<style scoped lang="scss">
.ratings {
  &__item {
    display: flex;
    align-items: center;
    border-radius: 12px;
    padding: 6px 10px 6px 6px;

    &.gradient-border {
      font-weight: 700;
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
