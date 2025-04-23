<script setup>
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import Modal from '@/components/Modal.vue'
import RankProgress from '@/components/RankProgress.vue'
import Place from '@/components/Place.vue'
import MainButton from '@/components/MainButton.vue'
import HistoryItem from '@/components/HistoryItem.vue'
import favoriteData from '@/favorite-history.json'

const userData = defineModel();

const showModal = ref('');

const places = {
  favorite: {
    name: 'Mutabor',
    image: 'mutabor.jpg',
    rating: 5,
    count: 12
  },
  recent: {
    name: 'Claude Monet',
    image: 'claude_monet.png',
    rating: 3,
    count: 13
  }
}

const formattedPoints = computed(() => userData.value.points.toLocaleString('ru'));
</script>

<template>
  <div class="content">
    <button class="info" @click="showModal = 'info'">
      <Icon name="info" size=24 />
    </button>
    <div class="main-profile">
      <div class="main-profile__avatar" :data-streak="userData.streak">
        <img class="main-profile__avatar-image" :src="`images/avatars/${userData.avatar}`">
      </div>
      <div>
        <div class="main-profile__name">{{ userData.name }}</div>
        <div class="main-profile__points count points gradient-text">{{ formattedPoints }}</div>
      </div>
    </div>
    <RankProgress v-bind="userData" />
    <div class="place">
      <Place type="favorite" v-bind="places.favorite" @click="showModal = 'favorite'" />
      <Place type="recent" v-bind="places.recent" />
    </div>
    <div class="bonuses block"></div>
    <MainButton href="/scan" icon="scan">Отсканировать чек</MainButton>

    <Teleport to="body">
      <Modal :show="showModal == 'info'" @close="showModal = null" />

      <Modal :show="showModal == 'favorite'" class="favorite" @close="showModal = null">
        <template #background>
          <video class="favorite__bg" src="/images/background.mp4" autoplay disablepictureinpicture loop muted playsinline></video>
        </template>
        <template #body>
          <Place type="favorite" class="modal__place" large v-bind="places.favorite" />
          <h2 class="h2">История посещений</h2>
          <div class="history-items modal__history">
            <HistoryItem v-for="data of favoriteData" v-bind="data" />
          </div>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.content--main {
  padding: 24px;
}

.info {
  position: absolute;
  top: 20px;
  right: 25px;
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
      border: 2px solid #FFC300;
      border-radius: 50%;
    }

    &::after {
      content: attr(data-streak);
      position: absolute;
      width: 28px;
      height: 28px;
      bottom: -10px;
      background: url(/images/streak.svg) no-repeat center / contain;
      color: #FFF;
      font-size: 11px;
      font-weight: 800;
      line-height: 28px;
      text-align: center;
      padding-top: 2px;
      filter: drop-shadow(0 2px 2px #FF8800);
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

.bonuses {
  height: 170px;
  background: #D7D7D7;
  margin-bottom: 48px;
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
