<script setup>
import { computed, onUpdated, ref, useTemplateRef } from 'vue'
import Icon from '@/components/Icon.vue'
import GammaOption from '@/components/GammaOption.vue'

const userData = defineModel();
const nameInput = useTemplateRef('nameInput');
const editingName = ref(false);

function updateCurrentGamma(value) {
  userData.value.gamma = value;
}

const dayWord = computed(() => {
  const rem100 = userData.value.streak % 100;
  const rem10 = rem100 % 10;
  if (rem10 == 1) return 'день';
  else if (rem10 > 1 && rem10 < 5 && (rem100 < 10 || rem100 > 20)) return 'дня';
  else return 'дней';
});

onUpdated(() => nameInput.value?.focus());

function copyRefLink(event) {
  navigator.clipboard.writeText(event.currentTarget.textContent)
    .catch(console.error);
}
</script>

<template>
  <div class="content">
    <div class="profile">
      <div class="profile__data">
        <div v-if="editingName" class="profile__row">
          <input
            ref="nameInput"
            v-model.lazy="userData.name"
            class="profile__name profile__name--input"
            @blur="() => (editingName = false)">
        </div>
        <div v-else class="profile__row">
          <span class="profile__name">{{ userData.name }}</span>
          <Icon name="dot" />
          <span class="profile__rank gradient-text">{{ userData.rank }}</span>
        </div>
        <div class="profile__tag">{{ userData.tag }}</div>
        <button class="profile__edit-name" @click="() => (editingName = true)">
          <Icon name="edit" />
          <span>Изменить</span>
        </button>
      </div>
      <img class="profile__avatar" :src="`images/avatars/${userData.avatar}`">
    </div>
    <div class="gamma block">
      <h3 class="gamma__title">Цветовая гамма</h3>
      <div class="gamma__options">
        <GammaOption
          v-for="n in 5"
          :id="n"
          :selected="n == userData.gamma"
          :valid="n <= 3"
          @click="() => { if (n <= 3) updateCurrentGamma(n) }" />
      </div>
    </div>
    <div class="separator"></div>
    <div class="profile__scrollable scrollable">
      <div class="totals">
        <div class="totals__block block">
        	<div class="totals__count gradient-text">69</div>
        	<div>Посещений</div>
        </div>
        <div class="totals__block block">
        	<div class="totals__count gradient-text">8 202₽</div>
        	<div>Средний чек</div>
        </div>
      </div>
      <div class="streak">
        <div class="streak__icon" :data-streak="userData.streak"></div>
        <div>Вы заходили в STOL<br>{{ userData.streak }} {{ dayWord }} подряд!</div>
      </div>
      <div class="invite block">
        <div class="invite__title gradient-text">Пригласи друга</div>
        <div>Получайте 10% баллов за каждого приглашенного!</div>
        <div class="invite__link">
          <span class="invite__link-content" @click="copyRefLink">t.me/stol-ref-1200453</span>
          <button class="invite__link-copy block">
            <Icon name="copy" size=20 />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content--profile {
  --side-padding: 24px;
  display: flex;
  flex-flow: column;
  padding: 20px var(--side-padding) 0;
}

.profile {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 32px;
  white-space: nowrap;

  &__data {
    flex: 1;
  }

  &__row {
    display: flex;
    gap: 0 6px;
    flex-flow: wrap;
    align-items: center;
  }

  &__name {
    font-size: 24px;
    font-weight: 800;

    &--input {
      width: 100%;
    }
  }

  &__rank {
    font-size: 16px;
    font-weight: 700;
  }

  &__tag {
    color: var(--font-black-60);
    font-size: 16px;
    font-weight: 700;
  }

  &__edit-name {
    display: flex;
    gap: 4px;
    background: #FFF;
    border-radius: 9em;
    box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
    font-size: 14px;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-top: 12px;
    padding: 9px 15px;
  }

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  &__scrollable {
    display: grid;
    gap: 20px;
  }
}

.gamma {
  border-radius: 16px;
  padding: 10px 18px 18px;
  margin-bottom: 16px;

  &__title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin-bottom: 20px;
  }

  &__options {
    display: flex;
    justify-content: space-between;
  }
}

.totals {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;

  &__block {
    display: grid;
    gap: 6px;
    line-height: 1;
    padding: 12px;
    text-align: center;
  }

  &__count {
    font-size: 24px;
    font-weight: 700;
  }
}

.streak {
  font-size: 16px;
  font-weight: 700;
  text-align: center;

  &__icon {
    height: 75px;
    background: url(/images/streak.svg) no-repeat center / contain;
    padding-top: 32px;
    filter: drop-shadow(0 2px 2px #FF8800);

    &::after {
      content: attr(data-streak);
      color: #FFF;
      font-size: 24px;
      font-weight: 800;
    }
  }
}

.invite {
  font-size: 12px;
  color: #666;
  letter-spacing: -0.04em;
  padding: 7px 12px;

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__link {
    display: flex;
    align-items: center;
    background: #F2F2F2;
    border-radius: 10px;
    color: var(--color-text);
    font-size: 16px;
    font-weight: 700;
    margin-top: 14px;
    padding: 10px 12px;

    &-content {
      flex: 1;
    }

    &-copy {
      border-radius: 8px;
      padding: 4px;
    }
  }
}
</style>
