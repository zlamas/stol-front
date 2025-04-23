<script setup>
import { computed } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  name: String,
  image: String,
  rating: Number,
  amount: Number,
  points: Number,
  date: String,
});

const formattedPoints = computed(() => '+' + props.points.toLocaleString('ru'));
const formattedAmount = computed(() => props.amount.toLocaleString('ru') + '₽');
</script>

<template>
  <div class="history-item block">
    <img class="history-item__image" :src="`images/places/${props.image}`">
    <div class="history-item__name">{{ props.name }}</div>
    <div class="history-item__points count points gradient-text">{{ formattedPoints }}</div>
    <StarRating class="history-item__rating" :rating gap=5 />
    <div class="history-item__amount">{{ formattedAmount }}</div>
    <div class="history-item__date">{{ date }}</div>
  </div>
</template>

<style scoped lang="scss">
.history-item {
  display: grid;
  gap: 0 10px;
  grid-template:
    "image name   points"
    "image rating rating"
    "image amount date  " /
    auto 1fr auto;
  align-items: start;
  padding: 8px 12px 8px 8px;

  &__image {
    grid-area: image;
    width: 61px;
    height: 61px;
    border-radius: 12px;
    object-fit: cover;
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
    color: var(--font-black-30);
    font-size: 14px;
    font-weight: 700;
  }

  &__date {
    grid-area: date;
    place-self: end;
    color: var(--font-black-60);
    font-size: 10px;
  }
}
</style>
