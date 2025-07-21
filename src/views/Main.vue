<script setup>
import { ref } from 'vue'
import { useFetch } from '@/fetch'
import useEventBus from '@/eventBus'
import HistoryItem from '@/components/HistoryItem.vue'
import MainButton from '@/components/MainButton.vue'
import Modal from '@/components/Modal.vue'
import NotificationItem from '@/components/NotificationItem.vue'
import PlaceBlock from '@/components/PlaceBlock.vue'
import ProgressDetails from '@/components/ProgressDetails.vue'
import RankProgress from '@/components/RankProgress.vue'
import UserInfo from '@/components/UserInfo.vue'

const { emit } = useEventBus();

const data = defineModel('data');
const activeTheme = defineModel('theme');

const expandedLevel = ref(null);

// if (!data.value) {
//   data.value = {
//     user: (await useFetch('user')).data.data,
//     favorite: (await useFetch(
//       'receipts/history/restaurant',
//       { restaurant_id: data.value.user.favorite?.id },
//     )).data.data,
//     rating: (await useFetch('leaderboard')).data.data,
//     history: (await useFetch('receipts/history')).data.data,
//   };
//
//   if (!data.value.user.avatar) {
//     data.value.user.avatar = 'images/avatar.png';
//   }

  await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
// }
</script>

<template>
  <div>
    <UserInfo
      v-bind="data.user"
      v-model="data.notifications"
      @change-view="emit('currentView', 'profile')" />
    <RankProgress
      class="rank-block block"
      v-bind="data.user.rank"
      @click="emit('currentModal', 'progress')" />
    <div class="places">
      <PlaceBlock
        type="favorite"
        :data="data.user.favorite"
        @click="emit('currentModal', 'favorite')" />
      <PlaceBlock
        type="recent"
        :data="data.user.recent"
        @click="emit('currentView', 'history')" />
    </div>
    <MainButton class="scan-button" href="/scan" icon="scan">Отсканировать чек</MainButton>

    <Modal
      name="favorite"
      type="modal"
      direction="right">
      <template #background>
        <video class="favorite__bg" :src="`images/bg-${activeTheme}.mp4`" autoplay disablepictureinpicture loop muted playsinline></video>
      </template>
      <template #body>
        <PlaceBlock type="favorite" class="favorite__info" large :data="data.user.favorite" />
        <h2 class="favorite__title h2">История посещений</h2>
        <div v-if="data.favorite.length" class="history-items">
          <HistoryItem v-for="item of data.favorite" v-bind="item" />
        </div>
        <div v-else class="favorite__empty block">
          <img class="favorite__empty-icon" src="/images/history-empty.png">
          <span>Вы еще ничего не отсканировали.<br>Пора скорее это исправить!</span>
        </div>
      </template>
    </Modal>

    <Modal
      name="progress"
      type="slideout"
      direction="up">
        <template #body>
          <RankProgress class="progress__bar" v-bind="data.user.rank" />
          <div class="levels scrollable">
            <ProgressDetails
              v-for="level of data.levels"
              v-bind="level"
              :current-level="data.user.rank.rank"
              v-model="expandedLevel" />
          </div>
        </template>
    </Modal>

    <Modal
      name="notifications"
      type="popup"
      direction="down">
      <template #body>
        <h2 class="h2">Уведомления</h2>
        <div
          v-for="(group, day) in data.notifications"
          class="notifications__group">
          <div class="notifications__day">{{ day }}</div>
          <div class="notifications__list">
            <NotificationItem
              v-for="item in group"
              v-bind="item"
              @click="item.unread = false" />
          </div>
        </div>
      </template>
    </Modal>
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

.levels {
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
