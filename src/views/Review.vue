<script setup>
import { computed, ref } from 'vue'
import { useFetch } from '@/fetch.js'
import { formatCurrency } from '@/format.js'
import MainButton from '@/components/MainButton.vue'
import StarRating from '@/components/StarRating.vue'

const receiptData = new URL(window.location.href).searchParams;
const formattedSum = formatCurrency(receiptData.get('total_sum'));

const state = ref('review');
const review = ref('');
const rating = ref(0);

const disabled = computed(() => rating.value == 0);

function sendReview() {
  const body = JSON.stringify({
    receipt_id: receiptData.get('id'),
    rating: rating.value,
    text: review.value,
  });
  useFetch('reviews', null, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body
  }).then((json) => {
    state.value = 'summary';
  });
}
</script>

<template>
  <div
    v-if="state == 'review'"
    class="content review"
    @click="() => {}">
    <h2 class="h2">Оценка заведения</h2>
    <div class="review__block block">
      <div>
        <h3 class="h3">Оценка</h3>
        <div class="review__small">Насколько вам понравилась еда и обслуживание?</div>
      </div>
      <StarRating
        class="review__rating"
        size=30
        gap=10
        :rating
        @update:rating="($event) => (rating = $event)" />
    </div>
    <div class="review__block block">
      <div>
        <h3 class="h3">Отзыв (опционально)</h3>
        <div class="review__small">Расскажите о своих впечатлениях!</div>
      </div>
      <textarea class="review__textarea" rows=12 v-model.lazy="review"></textarea>
    </div>
    <MainButton
      class="review__button"
      @click="sendReview"
      :disabled>Оценить</MainButton>
  </div>
  <div v-else class="content review">
    <h2 class="h2">Итог</h2>
    <div class="review__block review__summary block">
      <StarRating
        class="review__rating"
        size=30
        gap=10
        :rating />
      <div class="review__textarea">{{ review }}</div>
      <div class="separator"></div>
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
      <img src="/images/exclamation.svg">
      <div>Баллы за данный чек будут начислены вам после проверки администрацией.</div>
    </div>
    <MainButton
      class="review__button"
      href="/">Продолжить</MainButton>
  </div>
</template>

<style scoped lang="scss">
.review {
  display: flex;
  position: fixed;
  inset: 0;
  flex-flow: column;
  gap: 25px;
  background: var(--color-bg);
  padding: 30px 24px 40px;
  overflow: auto;

  &__block {
    display: grid;
    gap: 10px;
    border-radius: 16px;
    color: var(--font-black-30);
    padding: 15px;
  }

  &__summary {
    gap: 20px;
  }

  &__small {
    color: #999999;
    font-size: 12px;
    letter-spacing: -0.04em;
  }

  &__rating {
    filter: drop-shadow(0 2px 4px rgb(194 148 0 / 25%));
  }

  &__textarea {
    border-radius: 8px;
    background: #F2F2F2;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    padding: 10px 12px;
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
    justify-items: center;
    background: rgb(255 255 255 / 50%);
    color: var(--font-black-40);
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }

  &__button {
    margin-top: auto;
  }
}
</style>
