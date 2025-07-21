<script setup>
defineProps({
  image: String,
  name: String,
  description: String,
  cost: [Number, String],
  disabled: Boolean,
});
</script>

<template>
  <div :class="['reward', 'block', { disabled }]">
    <img class="reward__image" :src="image">
    <div class="reward__body">
      <div class="reward__name">{{ name }}</div>
      <div class="reward__description">{{ description }}</div>
      <button class="reward__button block gradient-border">
        <span class="count points gradient-text">{{ cost }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reward {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: #FFF;
  border-radius: 16px;
  letter-spacing: -0.04em;
  text-align: center;
  overflow: hidden;
  translate: 0;

  &.disabled {
    box-shadow: none;
    filter: grayscale(1);
  }

  &__image {
    width: 100%;
    height: 124px;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-flow: column;
    padding: 8px 16px 12px;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 7px;
    white-space: pre-line;
  }

  &__description {
    color: var(--theme-60);
    font-size: 12px;
    letter-spacing: -0.08em;
    margin-bottom: 12px;
  }

  &__button {
    width: 100%;
    background-color: #FFF;
    border-radius: 10px;
    margin-top: auto;
    padding: 8px;
    opacity: 1;
  }
}
</style>
