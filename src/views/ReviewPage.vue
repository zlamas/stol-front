<script setup>
import { computed, ref } from 'vue';
import useFetch from '@/fetch';
import { formatCurrency } from '@/funcs';
import SVGIcon from '@/components/SVGIcon.vue';
import MainButton from '@/components/MainButton.vue';
import StarRating from '@/components/StarRating.vue';

const receiptData = new URL(window.location.href).searchParams;
const formattedSum = formatCurrency(receiptData.get('total_sum'));

const places = [
  { name: 'Вкусно и Точка', icon: 'images/Вкусно и Точка - Лого.png' },
  { name: 'ВкусВилл', icon: 'images/ВкусВилл - Лого.png' },
  { name: 'ВКУС', icon: 'images/ВКУС - Лого.png' },
]

const state = ref('review');
const review = ref({
  placeIcon: null,
  name: '',
  text: '',
  rating: 0
})

const disabled = computed(() => !(review.value.name && review.value.rating));

function selectPlace(place) {
  review.value.name = place.name;
  review.value.placeIcon = place.icon;
  document.activeElement.blur();
}

function sendReview() {
  const body = JSON.stringify({
    receipt_id: receiptData.get('id'),
    rating: review.value.rating,
    text: review.value.text,
  });
  useFetch('reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body
  }).then(() => {
    state.value = 'summary';
  });
}
</script>

<template>
  <div
    v-if="state == 'review'"
    class="review"
    @click="() => {}"
  >
    <h2 class="h2 review__title">Оценка заведения</h2>
    <div class="review__block block">
      <div class="review__field">
        <h3 class="h3">Название</h3>
        <fieldset class="review__name">
          <input
            type="text"
            class="review__input field"
            v-model.lazy="review.name"
            required
          >
          <div class="review__places">
            <button
              v-for="place in places"
              :key="place.name"
              class="review__place"
              @click="selectPlace(place)"
            >
              <img class="review__place-icon" :src="place.icon">
              <span>{{ place.name }}</span>
            </button>
          </div>
        </fieldset>
      </div>
      <div class="review__field">
        <h3 class="h3">Оценка</h3>
        <div class="review__small">Насколько вам понравилась еда и обслуживание?</div>
        <StarRating
          class="review__rating"
          size="30"
          gap=10
          clickable
          :rating="review.rating"
          @update:rating="review.rating = $event"
        />
      </div>
    </div>
    <div class="review__block block">
      <div class="review__field">
        <h3 class="h3">Отзыв (опционально)</h3>
        <div class="review__small">Расскажите о своих впечатлениях!</div>
        <textarea
          class="review__textarea field"
          rows="12"
          v-model.lazy="review.text"
          required
        ></textarea>
      </div>
    </div>
    <MainButton
      class="review__button"
      @click="sendReview"
      :disabled
    >Оценить</MainButton>
  </div>
  <div v-else class="content review">
    <h2 class="review__title h2">Оценка заведения</h2>
    <div class="review__block review__summary block">
      <div class="review__field">
        <div class="review__place field">
          <img
            v-if="review.placeIcon"
            class="review__place-icon"
            :src="review.placeIcon"
          >
          <span>{{ review.name }}</span>
        </div>
        <StarRating
          class="review__rating"
          size="30"
          gap=10
          :rating="review.rating"
        />
      </div>
      <div v-if="review" class="review__textarea field">{{ review.text }}</div>
      <SVGIcon name="separator" class="separator" />
      <div class="review__points">
        <div class="review__points-row">
          <span>Потрачено:</span>
          <span class="gradient-text">{{ formattedSum }}</span>
        </div>
        <div class="review__points-row">
          <span>Получено баллов:</span>
          <span class="count points gradient-text">+{{ receiptData.get('points') }}</span>
        </div>
      </div>
    </div>
    <div class="review__block block review__note">
      <SVGIcon name="exclamation" size="24" />
      <div>Баллы за данный чек будут начислены вам после проверки администрацией.</div>
    </div>
    <div class="review__buttons">
      <button class="secondary-button" @click="state = 'review'">Изменить</button>
      <MainButton class="review__button" href="/">Оценить</MainButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.review {
  display: flex;
  position: fixed;
  inset: 0;
  flex-flow: column;
  gap: 25px;
  background: var(--theme-bg);
  padding: 30px 24px 40px;
  overflow: auto;

  &__title {
    letter-spacing: -0.04em;
  }

  &__block {
    display: grid;
    gap: 30px;
    padding: 15px;
  }

  &__field {
    display: grid;
    gap: 10px;
  }

  &__name {
    position: relative;
    border: 0;
    border-radius: 10px;

    &:valid {
      background: var(--theme-90);

      &:focus-within {
        border-radius: 10px 10px 0 0;
      }
    }
  }

  &__places {
    position: absolute;
    width: 100%;
    background: var(--theme-90);
    border-radius: 0 0 10px 10px;
    font-size: 16px;
    font-weight: 700;
    color: var(--theme-30);
    z-index: 9;

    :not(:focus-within) > &,
    :not(:valid) + & {
      display: none;
    }
  }

  &__place {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 7px;
    padding: 8px 10px;

    &-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
    }
  }

  &__summary {
    gap: 20px;
    color: var(--theme-30);
  }

  &__small {
    color: var(--theme-60);
    font-size: 12px;
    letter-spacing: -0.04em;
  }

  &__rating {
    filter: drop-shadow(0 2px 4px var(--star-shadow));
  }

  &__textarea {
    border-radius: 14px;
    line-height: 1;
    white-space: pre-line;
  }

  &__points {
    display: grid;
    gap: 12px;
    font-weight: 700;
    line-height: 1;

    &-row {
      display: flex;
      justify-content: space-between;
    }
  }

  &__note {
    gap: 12px;
    justify-items: center;
    background: var(--theme-note);
    color: var(--theme-40);
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }

  &__buttons {
    color: var(--theme-40);
    font-weight: 700;
    margin-top: auto;
  }
}
</style>
