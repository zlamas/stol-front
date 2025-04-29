<script setup>
import { computed, ref } from 'vue'
import { useFetch } from '@/fetch.js'
import { formatNumber } from '@/format.js'
import Icon from '@/components/Icon.vue'
import Modal from '@/components/Modal.vue'
import RankProgress from '@/components/RankProgress.vue'
import Place from '@/components/Place.vue'
import MainButton from '@/components/MainButton.vue'
import HistoryItem from '@/components/HistoryItem.vue'

const data = defineModel();
const showModal = ref('');

if (!data.value.user) {
  data.value.user = (await useFetch('user')).data.data;
  data.value.favorite = (await useFetch(
    'receipts/history/restaurant',
    { restaurant_id: data.value.user.favorite?.id },
  )).data.data;
  data.value.rating = (await useFetch('leaderboard')).data.data;
  data.value.history = (await useFetch('receipts/history')).data.data;

  if (!data.value.user.avatar) {
    data.value.user.avatar = 'images/avatar.png';
  }

  await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
}

const formattedPoints = computed(() => formatNumber(data.value.user.points));
</script>

<template>
  <div>
    <button class="info" @click="showModal = 'info'">
      <Icon name="info" size=24 />
    </button>
    <div class="main-profile">
      <div class="main-profile__avatar" :data-streak="data.user.daily_streak">
        <img class="main-profile__avatar-image" :src="data.user.avatar">
      </div>
      <div>
        <div class="main-profile__name">{{ data.user.username }}</div>
        <div class="main-profile__points count points gradient-text">{{ formattedPoints }}</div>
      </div>
    </div>
    <RankProgress v-bind="data.user.rank" />
    <div class="place">
      <Place
        type="favorite"
        :data="data.user.favorite"
        @click="() => { if (data.user.favorite) showModal = 'favorite' }" />
      <Place
        type="recent"
        :data="data.user.recent" />
    </div>
    <MainButton class="scan-button" href="/scan" icon="scan">Отсканировать чек</MainButton>

    <Modal :show="showModal == 'info'" @close="showModal = null" />

    <Modal :show="showModal == 'favorite'" class="favorite" @close="showModal = null">
      <template #background>
        <video class="favorite__bg" :src="`images/bg-${data.user.theme}.mp4`" autoplay disablepictureinpicture loop muted playsinline></video>
      </template>
      <template #body>
        <Place type="favorite" class="modal__place" large :data="data.user.favorite" />
        <h2 class="h2">История посещений</h2>
        <div class="history-items modal__history">
          <HistoryItem v-for="item of data.favorite" v-bind="item" />
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.view--main {
  display: flex;
  flex-flow: column;
  padding: 24px 24px 48px;
}

.info {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--theme-neutral);
}

.main-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  &__avatar {
    display: grid;
    justify-items: center;
    position: relative;

    &-image {
      width: 48px;
      height: 48px;
      border: 2px solid var(--yellow);
      border-radius: 50%;
    }

    &::after {
      content: attr(data-streak);
      position: absolute;
      width: 28px;
      height: 28px;
      bottom: -10px;
      background: url(/images/streak.svg) no-repeat center / contain;
      color: var(--theme-98);
      font-size: 11px;
      font-weight: 800;
      line-height: 28px;
      text-align: center;
      padding-top: 2px;
      filter: drop-shadow(0 2px 2px var(--orange));
    }
  }

  &__name {
    font-weight: 800;
  }
}

.place {
  display: grid;
  gap: 16px;
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
    z-index: -1;
  }
}


.modal {
  &__place {
    margin-bottom: 20px;
  }

  &__history {
    margin-top: 15px;
  }
}
</style>
