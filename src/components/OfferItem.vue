<script setup>
defineProps({
  name: String,
  description: String,
  price: [Number, String],
  preview_url: String,
  disabled: Boolean,
});
</script>

<template>
  <div :class="['offer', 'block', { disabled }]">
    <img class="offer__image" :src="preview_url">
    <span class="offer__price count points gradient-text">{{ price }}</span>
    <div class="offer__name">{{ name }}</div>
    <button class="offer-button">Купить</button>
  </div>
</template>

<style scoped lang="scss">
.offer {
  display: grid;
  gap: 8px;
  background-color: #FFF;
  border-radius: 16px;
  letter-spacing: -0.04em;
  padding: 8px;

  &.disabled {
    opacity: 0.5;
  }

  &__image {
    width: 100%;
    height: 149px;
    object-fit: cover;
    border-radius: 16px;
  }

  &__price {
    font-size: 18px;
  }

  &__name {
    font-size: 16px;
    margin-bottom: 4px;
  }
}
</style>
