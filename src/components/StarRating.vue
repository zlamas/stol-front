<script setup>
import Icon from '@/components/Icon.vue'

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
  clickable: Boolean,
});

defineEmits(['update:rating']);
</script>

<template>
  <div :class="['star-rating', { clickable }]">
    <Icon
      v-for="n in 5"
      name="star"
      :size
      :class="{ star__filled: n <= parseFloat(rating) }"
      @click="clickable && $emit('update:rating', n)" />
  </div>
</template>

<style scoped lang="scss">
.star-rating {
  display: flex;
  gap: v-bind('`${gap}px`');
  color: var(--yellow);
}

.star {
  &__filled {
    fill: currentcolor;

    .clickable > & {
      animation: scale 0.2s step-end;
    }

    .clickable:active > & {
      animation: none;
    }

    @keyframes scale {
      from { scale: 1.15; }
      to { scale: 1; }
    }
  }
}
</style>
