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
      <img class="top3__avatar-image" :src="`${props.avatar || 'images/avatar.png'}`">
    </div>
    <div class="rating__name">{{ props.username }}</div>
    <div class="top3__points count points">{{ formattedPoints }}</div>
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

    &.gold {
      --avatar-size: 80px;
      --gradient: linear-gradient(#F5CD3D, #B28C00);
      --medal: url(/images/gold.svg);
      --points-color: var(--gold);
      margin-bottom: 10px;

      .points {
        --count-icon: url(/images/points-gold.svg);
      }
    }

    &.silver {
      --gradient: linear-gradient(#C7C7C7, #5E5E5E);
      --medal: url(/images/silver.svg);
      --points-color: var(--silver);

      .points {
        --count-icon: url(/images/points-silver.svg);
      }
    }

    &.bronze {
      --gradient: linear-gradient(#FFC573, #8A690F);
      --medal: url(/images/bronze.svg);
      --points-color: var(--bronze);

      .points {
        --count-icon: url(/images/points-bronze.svg);
      }
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

  &__points {
    color: var(--points-color);
    font-weight: 700;
  }
}
</style>
