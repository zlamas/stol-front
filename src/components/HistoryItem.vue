<script setup>
import { computed } from 'vue';
import { formatNumber, formatCurrency, formatDate } from '@/funcs';
import SVGIcon from '@/components/SVGIcon.vue';
import StarRating from '@/components/StarRating.vue';

const props = defineProps({
  total_sum: [String, Number],
  points: Number,
  created_at: [String, Number],
  restaurant: Object,
});

const formattedPoints = computed(() => formatNumber(props.points));
const formattedSum = computed(() => formatCurrency(props.total_sum));
const formattedDate = computed(() => formatDate(props.created_at).toLowerCase());
</script>

<template>
  <div class="history-item block">
    <img
      v-if="restaurant.image_url"
      class="history-item__image"
      :src="restaurant.image_url"
    >
    <SVGIcon
      v-else
      class="history-item__image history-item__image--placeholder"
      name="place"
    />
    <div class="history-item__name">{{ restaurant.name }}</div>
    <div class="history-item__points count points gradient-text">+{{ formattedPoints }}</div>
    <StarRating
      class="history-item__rating"
      :rating="restaurant.rating"
      gap="5"
    />
    <div class="history-item__amount">{{ formattedSum }}</div>
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
