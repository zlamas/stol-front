<script setup>
import Icon from './Icon.vue'

defineProps({
  rating: [String, Number],
  size: {
    type: [String, Number],
    default: 15,
  },
  gap: {
    type: [String, Number],
    default: 8,
  },
});

defineEmits(['update:rating']);
</script>

<template>
  <div class="star-rating">
    <Icon
      v-for="n in 5"
      :class="{ star__filled: n <= parseFloat(rating) }"
      name="star"
      :size
      @click="() => $emit('update:rating', n)" />
  </div>
</template>

<style scoped lang="scss">
.star-rating {
  display: flex;
  gap: v-bind('`${gap}px`');
}

.star {
  &__filled {
    fill: #FFC300;
  }
}
</style>
