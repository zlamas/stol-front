<script setup>
import { computed, onMounted, ref } from 'vue'
import useFetch from '@/fetch'

import LoadingScreen from '@/views/LoadingScreen.vue'
import MainPage from '@/views/MainPage.vue'
import ScanPage from '@/views/ScanPage.vue'
import ReviewPage from '@/views/ReviewPage.vue'

const data = ref({
  loading: Promise.all([
    useFetch('user'),
    useFetch('leaderboard'),
    useFetch('receipts/history'),
    useFetch('offers/index'),
    useFetch('notifications/index'),
  ]).then((arr) => Promise.all(
    arr.concat(
      useFetch(
        'receipts/history/restaurant',
        null,
        { restaurant_id: arr[0].favorite?.id },
      )
    )
  )).then((arr) => arr.map((item) => item.data.data))
});

const pages = {
  '/': MainPage,
  '/scan': ScanPage,
  '/review': ReviewPage,
}

const currentPath = ref(window.location.hash);
const currentPage = computed(() => pages[currentPath.value.slice(1) || '/']);
const transition = ref('fade');

const activeTheme = computed(() => (
  data.value.user?.theme ||
  window.localStorage.getItem('theme') ||
  'white-pink'
));

onMounted(() => {
  window.location.hash = '';
  Telegram.WebApp.BackButton.hide();

  Telegram.WebApp.BackButton.onClick(() => {
    window.history.back();
  });

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
    if (window.location.hash == '') {
      Telegram.WebApp.BackButton.hide();
    } else {
      Telegram.WebApp.BackButton.show();
    }
  });
});

data.value.loading.then(([user, rating, history, offers, notifications, favorite]) => {
  data.value = { user, rating, history, offers, notifications, favorite };
  if (!data.value.user.avatar) {
    data.value.user.avatar = 'images/avatar.png';
  }
});
</script>

<template>
  <main :class="`main page ${activeTheme}`">
    <Transition
      :name="transition"
      @after-leave="transition = 'slide-in'"
    >
      <Suspense>
        <component
          :is="currentPage"
          v-model:data="data"
        />

        <template #fallback>
          <LoadingScreen :active-theme />
        </template>
      </Suspense>
    </Transition>
    <svg>
      <defs>
        <linearGradient id="gradient-main" x1="0" y1="0" x2="0" y2="100%">
          <stop stop-color="var(--theme-main-light)"/>
          <stop offset="1" stop-color="var(--theme-main)"/>
        </linearGradient>
      </defs>
    </svg>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.page {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: var(--theme-bg);
  color: var(--theme-20);
  font: 16px "Montserrat", sans-serif;
  letter-spacing: -0.02em;
}
</style>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate 0.3s;
}

.slide-in-enter-from {
  translate: 0 100%;
}

.slide-in-leave-to {
  translate: 0 -100%;
}
</style>
