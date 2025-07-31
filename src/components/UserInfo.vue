<script setup>
import { computed } from 'vue'
import useEventBus from '@/eventBus'
import { formatNumber } from '@/format'
import SVGIcon from '@/components/SVGIcon.vue'

const { emit } = useEventBus();

const props = defineProps({
  avatar: String,
  username: String,
  points: [Number, String],
  daily_streak: [Number, String],
});

const notifications = defineModel();

const formattedPoints = computed(() => formatNumber(props.points));
const unread = computed(() => notifications.value.find((item) => !item.is_read));
</script>

<template>
  <div class="user-info block">
    <img class="user-info__avatar" :src="avatar" @click="emit('currentView', 'profile')">
    <div class="user-info__center">
      <div class="user-info__name">
        <span>Привет, {{ username }}!</span>
        <span class="user-info__streak" :data-streak="daily_streak"></span>
      </div>
      <div class="count points gradient-text">{{ formattedPoints }}</div>
    </div>
    <button :class="['user-info__notification', { unread }]" @click="emit('currentModal', 'notifications')">
      <SVGIcon name="bell" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 9em;
  padding: 8px 12px;

  &__avatar {
    width: 48px;
    height: 48px;
    border: 2px solid var(--theme-90);
    border-radius: 50%;
  }

  &__center {
    flex: 1;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  &__streak {
    display: block;
    width: 20px;
    height: 25px;
    background: url(/images/streak-small.svg) no-repeat center / contain;
    color: var(--theme-98);
    font-size: 11px;
    font-weight: 800;
    line-height: 25px;
    text-align: center;
    filter: drop-shadow(0 2px 2px var(--orange));
    margin-top: -3px;
    padding-top: 3px;

    &::after {
      content: attr(data-streak);
    }
  }

  &__notification {
    position: relative;
    border: 2px solid var(--theme-90);
    border-radius: 50%;
    padding: 8px;

    &.unread {
      &::before {
        content: "";
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--theme-main-light);
      }
    }
  }
}
</style>
