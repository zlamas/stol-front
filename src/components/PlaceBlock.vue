<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  type: String,
  large: Boolean,
  data: Object,
  // label: String,
  // name: String,
  // image_url: String,
  // rating: [String, Number],
  // checks_count: Number,
  // points: Number,
});

const title = computed(() => ({
  favorite: 'Любимое',
  recent: 'Недавнее'
}[props.type]));
</script>

<template>
  <div
    v-if="data"
    :class="['place__block', 'block', { large }]"
    :style="data && { 'background-image': `url(${data.image_url})` }">
    <div class="place__content">
      <div class="place__title">{{ title }}</div>
      <div class="place__name">{{ data.name }}</div>
      <StarRating :rating="data.rating" v-bind="large && { size: 22, gap: 12 }" />
      <div v-if="type == 'favorite'" class="place__counter count checks">
        {{ data.checks_count }}
      </div>
      <div v-else-if="type == 'recent'" class="place__counter count points gradient-text">
        +{{ data.points }}
      </div>
    </div>
  </div>
  <div
    v-else
    :class="['place__block', 'block', 'fallback', { large }]">
    <video class="place__fallback" :src="`images/slideshow-${type}.mp4`" autoplay disablepictureinpicture loop muted playsinline></video>
    <div class="place__content">
      <div class="place__title">{{ title }}</div>
      <Icon name="question" v-bind="large && { size: 78 }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.place {
  &__block {
    position: relative;
    height: 123px;
    background: center / cover;
    border-radius: 16px;
    color: var(--theme-98);
    line-height: 1;
    text-align: center;

    &.large {
      height: 213px;
    }
  }

  &__content {
    display: grid;
    height: 100%;
    place-items: center;
    gap: 10px;
    background: linear-gradient(rgb(77 77 77 / 40%) 25%, rgb(179 179 179 / 40%));
    backdrop-filter: blur(2px);
    border-radius: inherit;
    padding: 14px;

    .large & {
      backdrop-filter: blur(4px);
      gap: 20px;
      padding: 30px;
    }
  }

  &__title {
    color: var(--theme-80);
    font-size: 14px;

    .large & {
      font-size: 20px;
    }
  }

  &__name {
    font-size: 16px;
    font-weight: 700;

    .large & {
      font-size: 28px;
    }
  }

  &__counter {
    &.points {
      position: relative;
      justify-content: center;

      &::before {
        content: "";
        position: absolute;
        width: 150%;
        height: 100%;
        background: #D9D9D9;
        border-radius: 9em;
        filter: blur(10px);
        z-index: -1;
      }
    }

    .large & {
      gap: 8px;
      font-size: 24px;

      &::after {
        width: 21px;
      }
    }
  }

  &__fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
