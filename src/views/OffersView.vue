<script setup>
import { computed, ref } from 'vue';
import { formatNumber } from '@/funcs';
import useEventBus from '@/eventBus';
import useFetch from '@/fetch';

import ModalPopup from '@/components/ModalPopup.vue';
import OfferItem from '@/components/OfferItem.vue';

const view = ref();

defineExpose({ view });

const { emit } = useEventBus();

const data = defineModel('data');

const selectedOffer = ref(null);
const formattedPoints = computed(() => formatNumber(data.value.user.points));

const storeColors = computed(() => ({
  'Telegram': ['#4FB8F9', '#2AA0EA'],
  'ВкусВилл': ['#2DBC64', '#39D073'],
  'Золотое Яблоко': ['#EBA94D', '#F0BE79'],
})[selectedOffer.value.store]);

const categoryColors = computed(() => ({
  'Гифт-карты': ['#864AFF', '#9966FF'],
  'Подписки': ['#FFA44A', '#FF8A14'],
})[selectedOffer.value.category]);

const tagColors = computed(() => Object.fromEntries([
  ...Object.entries(storeColors.value).map(([ k, v ]) => [ `--store-color-${k}`, v ]),
  ...Object.entries(categoryColors.value).map(([ k, v ]) => [ `--category-color-${k}`, v ]),
]));

const offerNameLineSplit = computed(() => selectedOffer.value.name.replace(' - ', '\n'));
const offerDescriptionLineSplit = computed(
  () => selectedOffer.value.description
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('')
);

function openOfferDetails(offer) {
  selectedOffer.value = offer;
  emit('currentModal', 'offer-details');
}

function purchaseOffer() {
  useFetch(
    `offers/${selectedOffer.value.id}/purchase`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  ).then(({ data: response, ok }) => {
    if (ok) {
      data.value.user.points = response.points;
      emit('currentModal', 'offer-success');
    }
  });
}
</script>

<template>
  <div ref="view">
    <div class="point-block block">
      <img class="point-block__avatar" :src="data.user.avatar">
      <div>Заработано</div>
      <div class="count points gradient-text">{{ formattedPoints }}</div>
    </div>
    <div class="scrollable scrollable--offers">
      <div class="offers">
        <OfferItem
          v-for="offer in data.offers"
          :key="offer.id"
          v-bind="offer"
          @click="openOfferDetails(offer)"
        />
      </div>
    </div>

    <ModalPopup
      name="offer-details"
      type="slideout"
      direction="up"
      :classes="{ disabled: selectedOffer?.disabled }"
    >
      <template #body>
        <img class="offer-details__image" :src="selectedOffer.image_url">
        <div class="offer-details__row" :style="tagColors">
          <div class="offer-details__tag offer-details__tag--store">{{ selectedOffer.store }}</div>
          <div class="offer-details__tag offer-details__tag--category">{{ selectedOffer.category }}</div>
        </div>
        <div class="offer-details__body">
          <div class="offer-details__name">{{ selectedOffer.name }}</div>
          <div class="offer-details__description" v-html="offerDescriptionLineSplit"></div>
        </div>
        <div class="offer-details__row offer-details__confirm">
          <button
            class="offer-button"
            :disabled="selectedOffer.disabled"
            @click="emit('currentModal', 'offer-confirm')"
          >
            Купить
          </button>
          <div class="offer-details__price block gradient-border">
            <span class="count points gradient-text">{{ selectedOffer.price }}</span>
          </div>
        </div>
      </template>
    </ModalPopup>

    <ModalPopup
      name="offer-confirm"
      type="popup"
      direction="up"
    >
      <template #body>
        <h2 class="h2">Покупка</h2>
        <div class="offer-modal__icon">
          <img :src="selectedOffer.preview_url">
        </div>
        <div class="offer-modal__name">{{ offerNameLineSplit }}</div>
        <div class="offer-modal__price block gradient-border">
          <span class="count points gradient-text">{{ selectedOffer.price }}</span>
        </div>
        <button class="offer-button offer-modal__button" @click="purchaseOffer">Продолжить</button>
      </template>
    </ModalPopup>

    <ModalPopup
      name="offer-success"
      type="popup"
      direction="down"
    >
      <template #body>
        <h2 class="h2">Поздравляю!</h2>
        <div class="offer-modal__icon">
          <img :src="selectedOffer.preview_url">
        </div>
        <div class="offer-modal__name">{{ offerNameLineSplit }}</div>
        <div class="offer-modal__success block">
          <p>Товар успешно куплен!</p>
          <p>Он будет активирован на твоем аккаунте в течение 24 часов.</p>
        </div>
      </template>
    </ModalPopup>
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
  box-shadow: 0 4px 8px var(--theme-drop-shadow);
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

.scrollable--offers {
  transform-style: preserve-3d;
}

.offers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  position: relative;
  z-index: -1;
}
</style>

<style lang="scss">
@use "@/assets/scss/mixins" as *;

.offer-button {
  width: 100%;
  background: #333333;
  box-shadow: 0 4px 8px rgb(0 0 0 / 25%);
  color: #FFF;
  font-weight: 700;
  line-height: 1;
  border-radius: 13px;
  padding: 12px;
}

.offer-details {
  font-family: "Inter", sans-serif;

  .modal__content {
    @include flex(16px, column);
    padding: 0 24px 20px;
  }

  &.disabled {
    .modal__content > :not(:last-child),
    .offer-button {
      opacity: 0.5;
    }
  }

  &__image {
    height: 259px;
    border-radius: 24px;
    flex-shrink: 0;
    object-fit: cover;
  }

  &__row {
    @include flex(8px);
  }

  &__tag {
    background: linear-gradient(to right, var(--tag-color-0), var(--tag-color-1));
    border-radius: 9em;
    box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
    color: #FFF;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 15px;

    &--store {
      --tag-color-0: var(--store-color-0);
      --tag-color-1: var(--store-color-1);
    }

    &--category {
      --tag-color-0: var(--category-color-0);
      --tag-color-1: var(--category-color-1);
    }
  }

  &__body {
    flex: 1;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin-bottom: 9px;
  }

  &__description {
    @include grid(7px);
    color: #666666;
    font-size: 16px;
    line-height: 1;
  }

  &__confirm {
    font-size: 20px;
    gap: 12px;
    translate: 0;
  }

  &__price {
    display: flex;
    justify-content: center;
    flex: 0 0 95px;
  }
}

.offer-confirm,
.offer-success {
  text-align: center;
  font-weight: 700;

  .modal__content {
    @include grid(12px);
    width: 233px;
    background: 0 0 / 75%;
    justify-items: center;
    padding: 28px 8px 8px;
    translate: 0;
  }

  .h2 {
    font-size: 18px;
    font-weight: 800;
  }

  .confirm-button {
    margin-top: 12px;
  }
}

.offer-confirm {
  --border-color: #FFF;

  .modal__content {
    background-color: #FFF;
    background-image: url(/images/bg-pattern.png);
  }
}

.offer-success {
  --border-color: #54E47B;
  color: #386146;

  .modal__content {
    background-color: #F5FFF8;
    background-image: url(/images/bg-pattern-green.png);
  }
}

.offer-modal {
  &__icon {
    position: relative;
    width: 81px;
    height: 81px;
    border-radius: 14px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 25%);

    .offer-success & {
      &::after {
        content: url(/images/offer-success.svg);
        position: absolute;
        bottom: 0;
        width: 27px;
        height: 27px;
        translate: -50% 50%;
      }
    }

    img {
      width: 100%;
      height: 100%;
      border: 3px solid var(--border-color);
      border-radius: inherit;
      object-fit: cover;
    }
  }

  &__name {
    font-size: 16px;
    letter-spacing: -0.04em;
    white-space: pre-line;
  }

  &__price {
    background-color: #FFF;
    border-radius: 10px;
    padding: 4px 16px;
    margin-bottom: 12px;
  }

  &__button {
    font-size: 17px;
    padding: 14px;
  }

  &__success {
    @include grid(10px);
    background: #E0FFEB99;
    border-radius: 16px;
    color: #4D4D4D;
    font-size: 12px;
    letter-spacing: -0.04em;
    padding: 13px 8px;
  }
}
</style>
