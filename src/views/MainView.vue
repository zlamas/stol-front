<script setup>
import { computed, ref } from 'vue'
import useEventBus from '@/eventBus'
import useFetch from '@/fetch'
import { formatDate } from '@/format'
import ranks from '@/ranks.json'

import HistoryItem from '@/components/HistoryItem.vue'
import MainButton from '@/components/MainButton.vue'
import ModalPopup from '@/components/ModalPopup.vue'
import NotificationItem from '@/components/NotificationItem.vue'
import PlaceBlock from '@/components/PlaceBlock.vue'
import RankDetails from '@/components/RankDetails.vue'
import RankProgress from '@/components/RankProgress.vue'
import UserInfo from '@/components/UserInfo.vue'

const { emit } = useEventBus();

const view = ref();

defineExpose({ view });

const data = defineModel('data');
const notificationsByDate = computed(() => Object.groupBy(
  data.value.notifications,
  ({ created_at }) => formatDate(created_at))
);
const expandedRank = ref(null);

function readNotification(item) {
  if (item.is_read) return;
  useFetch(
    `notifications/${item.id}/read`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );
  item.is_read = true;
}
</script>

<template>
  <div ref="view">
    <UserInfo
      v-bind="data.user"
      v-model="data.notifications"
      @change-view="emit('currentView', 'profile')"
    />
    <RankProgress
      class="rank-block block"
      v-bind="data.user.rank"
      @click="emit('currentModal', 'progress')"
    />
    <div class="places">
      <PlaceBlock
        type="favorite"
        :data="data.user.favorite"
        @click="emit('currentModal', 'favorite')"
      />
      <PlaceBlock
        type="recent"
        :data="data.user.recent"
        @click="emit('currentView', 'history')"
      />
    </div>
    <MainButton
      class="scan-button"
      href="/scan"
      icon="scan"
    >
      Отсканировать чек
    </MainButton>

    <ModalPopup
      name="favorite"
      type="modal"
      direction="right"
    >
      <template #background>
        <video
          class="favorite__bg"
          :src="`images/bg-${data.user.theme}.mp4`"
          autoplay
          disablepictureinpicture
          loop
          muted
          playsinline
        >
        </video>
      </template>
      <template #body>
        <PlaceBlock
          type="favorite"
          class="favorite__info"
          large
          :data="data.user.favorite"
        />
        <h2 class="favorite__title h2">История посещений</h2>
        <div
          v-if="data.favorite.length"
          class="history-items"
        >
          <HistoryItem
            v-for="item in data.favorite"
            :key="item.id"
            v-bind="item"
          />
        </div>
        <div
          v-else
          class="favorite__empty block"
        >
          <img class="favorite__empty-icon" src="/images/history-empty.png">
          <span>Вы еще ничего не отсканировали.<br>Пора скорее это исправить!</span>
        </div>
      </template>
    </ModalPopup>

    <ModalPopup
      name="progress"
      type="slideout"
      direction="up"
    >
        <template #body>
          <RankProgress
            class="progress__bar"
            v-bind="data.user.rank"
          />
          <div class="ranks scrollable">
            <RankDetails
              v-for="rank in ranks"
              :key="rank.id"
              v-bind="rank"
              v-model="expandedRank"
              :rank="data.user.rank"
            />
          </div>
        </template>
    </ModalPopup>

    <ModalPopup
      name="notifications"
      type="popup"
      direction="down"
    >
      <template #body>
        <h2 class="h2">Уведомления</h2>
        <div
          v-for="(group, day) in notificationsByDate"
          :key="day"
          class="notifications__group"
        >
          <div class="notifications__day">{{ day }}</div>
          <div class="notifications__list">
            <NotificationItem
              v-for="item in group"
              :key="item.id"
              v-bind="item"
              @click="readNotification(item)"
            />
          </div>
        </div>
      </template>
    </ModalPopup>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.view--main {
  @include flex(0, column);
  padding: 24px 24px 46px;
}

.info {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--theme-neutral);
}

.rank-block {
  font-size: 14px;
  margin: 24px 0 12px;
  padding: 10px 16px 16px;
}

.places {
  @include grid(13px);
  grid-template-columns: 1fr 1fr;
  margin-bottom: 24px;
}

.scan-button {
  margin-top: auto;
}

.favorite {
  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    margin-bottom: 20px;
  }

  &__title {
    margin-bottom: 12px;
  }

  &__empty {
    @include grid;
    justify-items: center;
    color: var(--theme-30);
    font-size: 16px;
    font-weight: 700;
    margin: auto;
    padding: 6px 10px 20px;
    text-align: center;

    &-icon {
      width: 100px;
    }
  }
}

.ranks {
  --theme-bg: #FFF;
  @include grid(12px);
  font-weight: 700;
  line-height: 1;
  padding: 0 12px;

  &::after {
    background: none;
  }
}
</style>

<style lang="scss">
@use "@/assets/scss/mixins" as *;

.progress {
  .modal__container {
    background: #FFF;
  }

  .modal__content {
    @include grid(16px);
    margin-top: 24px;
    padding: 0;
  }

  &__bar {
    padding: 0 24px;
  }
}

.notifications {
  .h2 {
    font-weight: 800;
    margin: 6px 0;
  }

  .modal__content {
    @include grid(14px);
    width: 345px;
    height: 492px;
    line-height: 1;
  }

  &__day {
    color: var(--theme-neutral);
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  &__list {
    @include grid(8px);
  }
}
</style>
