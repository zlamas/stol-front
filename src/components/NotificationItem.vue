<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import SVGIcon from '@/components/SVGIcon.vue';

const props = defineProps({
  is_read: Boolean,
  type: String,
  title: String,
  subtitle: String,
  body: String,
});

const detailsContent = useTemplateRef('detailsContent');
const active = ref(false);

const icon = computed(() => ({
  check_approved: 'success',
  check_declined: 'failure',
  rank_up: 'rank_up',
  referral_credit: 'points',
  purchase: 'purchase',
})[props.type]);

const contentHeight = computed(() => `${detailsContent.value.offsetHeight}px`);
</script>

<template>
  <div :class="['notification', { active, unread: !is_read }]" @click="active = !active">
    <div class="notification__block block">
      <div class="notification__content">
        <SVGIcon
          class="notification__icon"
          :name="icon"
          size="31"
        />
        <div class="notification__title">{{ title }}</div>
        <div class="notification__subtitle">{{ subtitle }}</div>
      </div>
    </div>
    <div class="notification__body">
      <div ref="detailsContent" class="notification__body-content">{{ body }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification {
  &__block {
    position: relative;
    background: #FFF;
    padding: 10px 12px;
    z-index: 1;
  }

  &__content {
    display: grid;
    grid-template:
      "icon title"
      "icon subtitle" /
      auto 1fr;
    align-items: center;
    gap: 4px 11px;
    transition: opacity 0.2s;
    opacity: 0.65;

    :is(.active, .unread) & {
      opacity: 1;
    }
  }

  &__icon {
    width: 31px;
    height: 31px;
    grid-area: icon;
  }

  &__title {
    grid-area: title;
    font-size: 16px;
    font-weight: 700;

    .unread & {
      &::after {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--theme-main-gradient);
        margin-left: 4px;
        vertical-align: middle;
      }
    }
  }

  &__subtitle {
    grid-area: subtitle;
    color: var(--theme-55);
    font-size: 14px;
  }

  &__body {
    display: grid;
    height: v-bind(contentHeight);
    align-content: center;
    background: var(--theme-notification) url(/images/bg-pattern.png) 0 0 / 33%;
    border-radius: 0 0 15px 15px;
    box-shadow: 0 1px 2px var(--theme-drop-shadow);
    color: var(--theme-30);
    font-size: 13px;
    line-height: normal;
    margin: 0 8px;
    overflow: hidden;
    translate: 0 -2px;
    transition: height 0.5s var(--bounce), opacity 0.3s;

    .notification:not(.active) & {
      height: 0;
      opacity: 0;
    }

    &-content {
      padding: 10px 12px;
    }
  }
}
</style>
