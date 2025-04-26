<script setup>
import { computed, onUpdated, ref, useTemplateRef, watch } from 'vue'
import { useFetch } from '@/fetch.js'
import { formatCurrency } from '@/format.js'
import Icon from '@/components/Icon.vue'
import ThemeOption from '@/components/ThemeOption.vue'

const themes = ['white-pink', 'gray-brown', 'gray-black'];

const data = defineModel();
const nameInput = useTemplateRef('nameInput');

const editingName = ref(false);
const copied = ref(null);

const dayWord = computed(() => {
  const rem100 = data.value.user.daily_streak % 100;
  const rem10 = rem100 % 10;
  if (rem10 == 1) return 'день';
  else if (rem10 > 1 && rem10 < 5 && (rem100 < 10 || rem100 > 20)) return 'дня';
  else return 'дней';
});

const formattedAverage = computed(() => formatCurrency(data.value.user.average_check));

onUpdated(() => nameInput.value?.focus());

watch(
  [() => data.value.user.username, () => data.value.user.theme],
  ([username, theme]) => {
    const body = JSON.stringify({ username, theme });
    useFetch('user', null, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body
    });
  }
);

function updateCurrentTheme(value) {
  data.value.user.theme = value;
}

function copyRefLink(event) {
  navigator.clipboard.writeText(event.currentTarget.textContent)
    .then(() => {
      clearTimeout(copied.value);
      copied.value = setTimeout(() => { copied.value = null }, 3000)
    })
    .catch(console.error);
}
</script>

<template>
  <div>
    <div class="profile">
      <div class="profile__data">
        <div v-if="editingName" class="profile__row">
          <input
            ref="nameInput"
            v-model.lazy="data.user.username"
            class="profile__name profile__name--input"
            @blur="() => (editingName = false)">
        </div>
        <div v-else class="profile__row">
          <span class="profile__name">{{ data.user.username }}</span>
          <div class="profile__dot"></div>
          <span class="profile__rank gradient-text">{{ data.user.rank.current }}</span>
        </div>
        <div class="profile__tag">@{{ data.user.username }}</div>
        <button class="profile__edit-name" @click="() => (editingName = true)">
          <Icon name="edit" />
          <span>Изменить</span>
        </button>
      </div>
      <img class="profile__avatar" :src="data.user.avatar">
    </div>
    <div class="theme block">
      <h3 class="theme__title">Цветовая гамма</h3>
      <div class="theme__options">
        <ThemeOption
          v-for="(n, i) in 5"
          :id="themes[i]"
          :selected="data.user.theme == themes[i]"
          :valid="i < 3"
          @click="() => { if (i < 3) updateCurrentTheme(themes[i]) }" />
      </div>
    </div>
    <div class="separator"></div>
    <div class="profile__scrollable scrollable">
      <div class="totals">
        <div class="totals__block block">
        	<div class="totals__count gradient-text">{{ data.user.visits }}</div>
        	<div>Посещений</div>
        </div>
        <div class="totals__block block">
        	<div class="totals__count gradient-text">{{ formattedAverage }}</div>
        	<div>Средний чек</div>
        </div>
      </div>
      <div class="streak">
        <div class="streak__icon" :data-streak="data.user.daily_streak"></div>
        <div>Вы заходили в STOL<br>{{ data.user.daily_streak }} {{ dayWord }} подряд!</div>
      </div>
      <div class="invite block">
        <div class="invite__title gradient-text">Пригласи друга</div>
        <div>Получайте 10% баллов за каждого приглашенного!</div>
        <div class="invite__link">
          <span class="invite__link-content" @click="copyRefLink">{{ data.user.referral_link }}</span>
          <button :class="['invite__link-copy', 'block', { copied }]">
            <Icon v-if="copied" name="check" size=16 />
            <Icon v-else name="copy" size=20 />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view--profile {
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

  &__dot {
    width: 5px;
    height: 5px;
    background: var(--color-main-gradient);
    border-radius: 50%;
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

.theme {
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
    gap: 8px;
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
      overflow-wrap: anywhere;
    }

    &-copy {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      padding: 4px;

      svg {
        margin: auto;
      }

      &.copied {
        background: #6FF69C;
      }
    }
  }
}
</style>
