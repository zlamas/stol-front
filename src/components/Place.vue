<script setup>
import { computed } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  type: String,
  large: Boolean,
  label: String,
  name: String,
  image_url: String,
  rating: [String, Number],
  checks_count: Number,
  points: Number,
});

const starSize = computed(() => {
  if (props.large) return { size: 20, gap: 12 };
  else return {};
});
</script>

<template>
  <div
    :class="['place__block', 'block', { large }]"
    :style="{ 'background-image': `url(${props.image_url})` }"
  >
    <div class="place__content">
      <div class="place__title">{{ props.label }}</div>
      <div class="place__name">{{ props.name }}</div>
      <StarRating :rating v-bind="starSize" />
      <div v-if="props.type == 'favorite'" class="place__counter count checks">
        {{ props.checks_count }}
      </div>
      <div v-else-if="props.type == 'recent'" class="place__counter count points gradient-text">
        +{{ props.points }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.place {
  &__block {
    background: center / cover;
    line-height: 1;
    overflow: hidden;
    text-align: center;
  }

  &__content {
    display: grid;
    height: 100%;
    justify-items: center;
    gap: 10px;
    background: linear-gradient(rgb(77 77 77 / 40%) 25%, rgb(179 179 179 / 40%));
    backdrop-filter: blur(4px);
    padding: 14px;

    .large & {
      gap: 20px;
      background: rgb(255 255 255 / 20%);
      padding: 20px;
    }
  }

  &__title {
    color: #E0B8C4;
    font-size: 14px;

    .large & {
      font-size: 20px;
    }
  }

  &__name {
    color: #FFF;
    font-size: 16px;
    font-weight: 700;

    .large & {
      font-size: 28px;
    }
  }

  &__counter {
    &.points {
      filter: drop-shadow(0 0 10px #FFF);
    }

    &::after {
      width: 16px;
    }

    .large & {
      gap: 8px;
      font-size: 24px;

      &::after {
        width: 24px;
      }
    }
  }
}
</style>
