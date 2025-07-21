<script setup>
import { computed, ref } from 'vue'
import { formatNumber } from '@/format'
import useEventBus from '@/eventBus'
import Modal from '@/components/Modal.vue'
import RewardItem from '@/components/RewardItem.vue'

const { emit } = useEventBus();

const data = defineModel('data');

const selectedReward = ref(null);
const formattedPoints = computed(() => formatNumber(data.value.user.points));

function openRewardConfirm(reward) {
  if (data.value.user.points < reward.cost) return;
  selectedReward.value = reward;
  emit('currentModal', 'reward-confirm');
}
</script>

<template>
  <div>
    <div class="point-block block">
      <img class="point-block__avatar" :src="data.user.avatar">
      <div>Заработано</div>
      <div class="count points gradient-text">{{ formattedPoints }}</div>
    </div>
    <div class="scrollable">
      <div class="rewards">
        <RewardItem
          v-for="(reward, i) in data.rewards"
          v-bind="reward"
          :disabled="data.user.points < reward.cost"
          @click="openRewardConfirm(reward)" />
      </div>
    </div>

    <Modal
      name="reward-confirm"
      type="popup"
      direction="down">
      <template #body>
        <h2 class="h2">Покупка</h2>
        <img class="reward-modal__icon" :src="selectedReward.image">
        <div class="reward-modal__name">{{ selectedReward.name }}</div>
        <div class="reward-modal__cost block gradient-border">
          <span class="count points gradient-text">{{ selectedReward.cost }}</span>
        </div>
        <button class="confirm-button button-animated" @click="emit('currentModal', 'reward-success')">Продолжить</button>
      </template>
    </Modal>

    <Modal
      name="reward-success"
      type="popup"
      direction="down">
      <template #body>
        <h2 class="h2">Поздравляю!</h2>
        <img class="reward-modal__icon" :src="selectedReward.image">
        <div class="reward-modal__name">{{ selectedReward.name }}</div>
        <div class="reward-modal__success block">
          <p>Товар успешно куплен!</p>
          <p>Он будет активирован на твоем аккаунте в течение 24 часов.</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.view--offers {
  --side-padding: 24px;
  display: grid;
  gap: 8px;
  grid-template-rows: auto 1fr;
  padding: 0 var(--side-padding);
}

.point-block {
  display: grid;
  gap: 8px;
  justify-items: center;
  background: #FFF url(/images/bg-pattern.png) 0 0 / 50%;
  box-shadow: 0 4px 8px #C2708940;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  margin: 0 calc(-1 * var(--side-padding));
  padding: 24px;

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .points {
    font-size: 20px;
  }
}

.rewards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}
</style>

<style lang="scss">
@use "@/assets/scss/mixins" as *;

.reward-confirm,
.reward-success {
  text-align: center;
  font-weight: 700;

  .modal__content {
    @include grid(12px);
    width: 259px;
    background: 0 0 / 75%;
    justify-items: center;
    padding-top: 28px;
    translate: 0;
  }

  .h2 {
    font-size: 18px;
    font-weight: 800;
  }

  .confirm-button {
    margin-top: 20px;
  }
}

.reward-confirm {
  .modal__content {
    background-color: #FFF;
    background-image: url(/images/bg-pattern.png);
  }
}

.reward-success {
  color: #386146;

  .modal__content {
    background-color: #E5FFEE;
    background-image: url(/images/bg-pattern-green.png);
  }
}

.reward-modal {
  &__icon {
    width: 77px;
    height: 77px;
    border-radius: 14px;
    box-shadow: 0 2px 4px #00000040;
    object-fit: cover;
  }

  &__name {
    font-size: 14px;
    letter-spacing: -0.04em;
    white-space: pre-line;
  }

  &__cost {
    background-color: #FFF;
    border-radius: 10px;
    padding: 4px 16px;
  }

  &__success {
    @include grid(10px);
    background: #FFF;
    font-size: 12px;
    letter-spacing: -0.04em;
    padding: 13px;
  }
}
</style>
