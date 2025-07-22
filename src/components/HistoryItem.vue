<script setup>
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import StarRating from '@/components/StarRating.vue'

const props = defineProps({
  total_sum: [String, Number],
  points: Number,
  created_at: [String, Number],
  restaurant: Object,
});

const formattedPoints = computed(() => '+' + props.points.toLocaleString('ru'));
const formattedAmount = computed(() => parseFloat(props.total_sum).toLocaleString('ru') + '₽');
const formattedDate = computed(() => {
  const date = new Date(props.created_at);
  const diffDays = Math.floor((Date.now() - props.created_at) / (1000 * 60 * 60 * 24));
  switch (diffDays) {
    case 0: return 'сегодня';
    case 1: return 'вчера';
    case 2: return '2 дня назад';
    default: return date.toLocaleDateString('ru');
  }
});
</script>

<template>
  <div class="history-item block">
    <img v-if="props.restaurant.image_url" class="history-item__image" :src="props.restaurant.image_url">
    <Icon v-else name="place" class="history-item__image history-item__image--placeholder" />
    <div class="history-item__name">{{ props.restaurant.name }}</div>
    <div class="history-item__points count points gradient-text">{{ formattedPoints }}</div>
    <StarRating class="history-item__rating" :rating="props.restaurant.rating" gap=5 />
    <div class="history-item__amount">{{ formattedAmount }}</div>
    <div class="history-item__date">{{ formattedDate }}</div>
  </div>
</template>

<style scoped lang="scss">
.history-item {
  display: grid;
  gap: 7px 10px;
  grid-template:
    "image name   points"
    "image rating rating"
    "image amount date  " /
    auto 1fr auto;
  align-items: start;
  padding: 8px 12px 8px 8px;

  &__image {
    grid-area: image;
    width: 67px;
    height: 67px;
    background: var(--theme-90);
    border-radius: 12px;
    object-fit: cover;

    &--placeholder {
      padding: 18px;
    }
  }

  &__name {
    grid-area: name;
    font-size: 16px;
    font-weight: 700;
  }

  &__points {
    grid-area: points;
    justify-self: end;
  }

  &__rating {
    grid-area: rating;
  }

  &__amount {
    grid-area: amount;
    align-self: end;
    color: var(--theme-40);
    font-size: 14px;
    font-weight: 700;
  }

  &__date {
    grid-area: date;
    place-self: end;
    color: var(--theme-60);
    font-size: 10px;
  }
}
</style>
