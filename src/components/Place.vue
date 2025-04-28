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

const starSize = computed(() => {
  if (props.large) return { size: 20, gap: 12 };
  else return {};
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
      <StarRating :rating="data.rating" v-bind="starSize" />
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
      <Icon name="question" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.place {
  &__block {
    position: relative;
    height: 123px;
    background: center / cover;
    color: var(--theme-98);
    line-height: 1;
    overflow: hidden;
    text-align: center;

    &.large {
      height: 198px;
    }

    &.fallback {
      color: var(--theme-80);
    }
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

  &__fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
