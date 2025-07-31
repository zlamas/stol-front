<script setup>
import { computed, onMounted, onUpdated, ref, useTemplateRef, watch } from 'vue'
import useEventBus from '@/eventBus'
import useFetch from '@/fetch'
import { formatCurrency } from '@/format'
import SVGIcon from '@/components/SVGIcon.vue'
import ModalPopup from '@/components/ModalPopup.vue'
import ThemeOption from '@/components/ThemeOption.vue'

const view = ref();

defineExpose({ view });

const themes = ['white-pink', 'gray-brown'];

const data = defineModel('data');
const nameInput = useTemplateRef('nameInput');

const editingName = ref(false);
const showLockedPopup = ref(null);
const copied = ref(null);

const { emit } = useEventBus();

const dayWord = computed(() => {
  const rem100 = data.value.user.daily_streak % 100;
  const rem10 = rem100 % 10;
  if (rem10 == 1) return 'день';
  else if (rem10 > 1 && rem10 < 5 && (rem100 < 10 || rem100 > 20)) return 'дня';
  else return 'дней';
});

const formattedAverage = computed(() => formatCurrency(data.value.user.average_check));
const optionOffset = ref(0);

onMounted(() => updateThemeMarker(data.value.user.theme));

onUpdated(() => {
  if (editingName.value) nameInput.value.focus();
});

watch(
  [() => data.value.user.app_username, () => data.value.user.theme],
  ([username, theme]) => {
    const body = JSON.stringify({ username, theme });
    useFetch('user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body
    });
    window.localStorage.setItem('theme', theme);
    updateThemeMarker(theme);
  }
);

function updateThemeMarker(theme) {
  optionOffset.value = document.querySelector(`.theme-option.${theme}`).offsetLeft;
}

function handleThemeClick(i) {
  if (i < themes.length) {
    data.value.user.theme = themes[i];
  } else {
    clearTimeout(showLockedPopup.value);
    showLockedPopup.value = setTimeout(() => { showLockedPopup.value = null }, 1800);
  }
}

function copyRefLink(event) {
  navigator.clipboard.writeText(event.currentTarget.textContent)
    .then(() => {
      clearTimeout(copied.value);
      copied.value = setTimeout(() => { copied.value = null }, 2000)
    })
    .catch(console.error);
}
</script>

<template>
  <div ref="view" class="scrollable">
    <div class="profile">
      <div class="profile__data">
        <input
          v-show="editingName"
          ref="nameInput"
          v-model.lazy="data.user.app_username"
          class="profile__row profile__name profile__name--input"
          @blur="editingName = false"
        >
        <div
          v-show="!editingName"
          class="profile__row"
        >
          <span class="profile__name">{{ data.user.app_username }}</span>
          <div class="profile__dot"></div>
          <span class="profile__rank gradient-text">{{ data.user.rank.current }}</span>
        </div>

        <div class="profile__tag">@{{ data.user.username }}</div>
        <button
          class="profile__edit-name button-animated"
          @click="editingName = true"
        >
          <SVGIcon name="edit" />
          <span>Изменить</span>
        </button>
      </div>
      <img class="profile__avatar" :src="data.user.avatar">
    </div>

    <div class="theme block" :style="{ '--option-offset': `${optionOffset}px` }">
      <h3 class="theme__title">Цветовая гамма</h3>
      <div class="theme__options">
        <ThemeOption
          v-for="(n, i) in 5"
          :key="n"
          :id="themes[i]"
          :selected="data.user.theme == themes[i]"
          :valid="i < themes.length"
          @click="handleThemeClick(i)" />
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showLockedPopup" class="locked-popup block">
        <div>Гамма Закрыта</div>
        <div class="locked-popup__countdown">
          <div class="locked-popup__bar"></div>
        </div>
      </div>
    </Transition>

    <SVGIcon name="separator" class="separator" />

    <div class="profile__scrollable">
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

      <div class="streak" @click="emit('currentModal', 'streak-popup')">
        <div class="streak__icon" :data-streak="data.user.daily_streak"></div>
        <div>Вы заходили в STOL<br>{{ data.user.daily_streak }} {{ dayWord }} подряд!</div>
      </div>

      <div class="invite block">
        <div class="invite__title gradient-text">Пригласи друга</div>
        <div>Получайте 10% баллов за каждого приглашенного!</div>
        <div class="invite__link field" @click="copyRefLink">
          <span class="invite__link-content">{{ data.user.referral_link }}</span>
          <Transition name="fade">
            <button v-if="copied" class="invite__link-copy block copied">
              <SVGIcon name="check" size="16" />
            </button>
            <button v-else class="invite__link-copy block">
              <SVGIcon name="copy" size="20" />
            </button>
          </Transition>
        </div>
      </div>

      <div class="tutorial">
        <div class="tutorial__button block button-animated" @click="emit('currentModal', 'tutorial-dialog')">
          <SVGIcon name="tutorial" />
        </div>
        <div>Обучение</div>
      </div>
    </div>

    <ModalPopup
      name="streak-popup"
      type="popup"
      direction="down">
      <template #body>
        <div class="streak__icon" :data-streak="data.user.daily_streak"></div>
        <h2 class="h2">Стрик</h2>
        <div>
          Заходи в STOL каждый день,<br>чтобы огонек не потух!<br><br>
          Чем дольше продержишься -<br>тем круче награды!
        </div>
        <div class="streak__rewards">
          <div class="streak__reward">
            <SVGIcon class="streak__reward-icon" name="no-theme" />
            <span>Гаммы</span>
          </div>
          <div class="streak__reward">
            <img class="streak__reward-icon" src="/images/rank_up.svg">
            <span>Ранги</span>
          </div>
          <div class="streak__reward">
            <img class="streak__reward-icon" src="/images/points.svg">
            <span>+ Баллы</span>
          </div>
        </div>
      </template>
    </ModalPopup>

    <ModalPopup
      name="tutorial-dialog"
      type="popup"
      direction="up">
      <template #body>
        <h2 class="h2">Обучение</h2>
        <SVGIcon name="tutorial" size="48" />
        <div>Хочешь пройти обучение<br>еще раз?</div>
        <div class="dialog-buttons">
          <button class="dialog-button dialog-button--yes block button-animated">Да</button>
          <button
            class="dialog-button block button-animated"
            @click="emit('currentModal', null)"
          >
            Нет
          </button>
        </div>
      </template>
    </ModalPopup>
  </div>
</template>

<style scoped lang="scss">
.view--profile {
  --vertical-padding: 8px;
  padding: var(--vertical-padding) 24px;
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
    background: var(--theme-main-gradient);
    border-radius: 50%;
  }

  &__rank {
    font-size: 16px;
    font-weight: 700;
  }

  &__tag {
    color: var(--theme-neutral);
    font-size: 16px;
    font-weight: 700;
  }

  &__edit-name {
    display: flex;
    gap: 4px;
    background: var(--theme-98);
    border-radius: 9em;
    font-size: 14px;
    line-height: 1;
    letter-spacing: -0.04em;
    margin-top: 12px;
    padding: 9px 15px;

    &:active {
      background: #FAEFF6;
      color: var(--theme-40);
    }
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
    --option-size: 44px;
    position: relative;
    display: flex;
    justify-content: space-between;

    &::after {
      content: url(/images/selected.svg);
      position: absolute;
      width: 22px;
      height: 22px;
      bottom: -6px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
      transition: translate 0.3s;
      translate: calc(var(--option-offset) + 28px);
    }
  }
}

.totals {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  margin-top: 16px;

  &__block {
    display: grid;
    gap: 6px;
    line-height: 1;
    letter-spacing: -0.04em;
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
  letter-spacing: -.04em;
  text-align: center;

  &__icon {
    height: 75px;
    background: url(/images/streak.svg) no-repeat center / contain;
    padding-top: 32px;
    filter: drop-shadow(0 2px 2px var(--orange));
    text-align: center;

    &::after {
      content: attr(data-streak);
      color: var(--theme-98);
      font-size: 24px;
      font-weight: 800;
    }
  }

  &__rewards {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    background: var(--theme-92);
    border-radius: 12px;
    font-size: 12px;
    margin-top: 20px;
    padding: 12px 24px;
  }

  &__reward {
    &-icon {
      width: 100%;
      height: 35px;
      margin-bottom: 7px;
      filter: drop-shadow(0 2px 4px var(--theme-drop-shadow));
    }
  }
}

.invite {
  color: var(--theme-40);
  font-size: 12px;
  letter-spacing: -0.04em;
  padding: 7px 12px 12px;

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__link {
    position: relative;
    display: flex;
    align-items: center;
    color: var(--theme-20);
    margin-top: 14px;

    &-content {
      flex: 1;
      overflow-wrap: anywhere;
    }

    &-copy {
      position: absolute;
      right: 6px;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      padding: 4px;

      svg {
        margin: auto;
      }

      &.copied {
        background: var(--green);
      }
    }
  }
}

.tutorial {
  display: grid;
  gap: 8px;
  justify-items: center;
  font-size: 14px;
  font-weight: 700;
  margin-top: 10px;
  letter-spacing: -0.04em;

  &__button {
    border-radius: 50%;
    padding: 15px;

    &:active {
      background: var(--theme-98);
    }
  }
}

.locked-popup {
  position: fixed;
  top: 24px;
  right: 24px;
  border-radius: 10px;
  color: var(--theme-30);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  padding: 10px;
  overflow: hidden;

  &__countdown {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: #D9D9D9;
  }

  &__bar {
    height: 100%;
    background: var(--theme-main-gradient);
    border-radius: 9em;
    margin-left: auto;
    animation: countdown 1.2s 0.3s linear forwards;
  }
}

@keyframes countdown {
  0% { width: 100% }
  100% { width: 0; }
}
</style>

<style lang="scss">
.streak-popup {
  color: var(--theme-40);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  text-align: center;

  .modal__content {
    display: grid;
  }

  .streak__icon {
    margin-top: 10px;
  }

  .h2 {
    color: var(--theme-20);
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-top: 5px;
    margin-bottom: 10px;
  }
}

.tutorial-dialog {
  color: var(--theme-40);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  text-align: center;

  .modal__content {
    display: grid;
    justify-items: center;
    gap: 8px;
  }

  .h2 {
    color: var(--theme-20);
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-top: 12px;
  }
}
</style>
