<script setup>
import { computed } from 'vue'
const props = defineProps({
  position: Number,
  avatar: String,
  username: String,
  points: Number,
});

const formattedPoints = computed(() => props.points.toLocaleString('ru'));
</script>

<template>
  <div class="top3__user">
    <div class="top3__avatar">
      <img class="top3__avatar-image" :src="props.avatar || 'images/avatar.png'">
    </div>
    <div class="rating__name">{{ props.username }}</div>
    <div class="count points gradient-text">{{ formattedPoints }}</div>
  </div>
</template>

<style scoped lang="scss">
.top3 {
  &__user {
    --avatar-size: 70px;
    display: grid;
    gap: 8px;
    max-width: 112px;
    justify-items: center;
    line-height: 1;
    grid-row: 1;

    &:nth-child(1) {
      --avatar-size: 80px;
      --gradient: linear-gradient(#F5CD3D, #B28C00);
      --medal: url(/images/gold.svg);
      margin-bottom: 10px;
      grid-column: 2;
    }

    &:nth-child(2) {
      --gradient: linear-gradient(#C7C7C7, #5E5E5E);
      --medal: url(/images/silver.svg);
      grid-column: 1;
    }

    &:nth-child(3) {
      --gradient: linear-gradient(#FFC573, #8A690F);
      --medal: url(/images/bronze.svg);
      grid-column: 3;
    }
  }

  &__avatar {
    display: grid;
    filter: drop-shadow(0 4px 8px rgb(0 0 0 / 25%));
    font-size: 16px;

    &::after {
      content: var(--medal);
      margin-top: -20%;
    }

    &-image {
      width: var(--avatar-size);
      height: var(--avatar-size);
      background: var(--gradient);
      border-radius: 50%;
      padding: 4px;

      .gold & {
        box-shadow: 0 0 50px #FAD038;
      }
    }
  }

  &__name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
