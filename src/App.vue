<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import useEventBus from '@/eventBus';
import useFetch from '@/fetch';

import LoadingScreen from '@/views/LoadingScreen.vue';
import MainPage from '@/views/MainPage.vue';
import ScanPage from '@/views/ScanPage.vue';
import ReviewPage from '@/views/ReviewPage.vue';
import TutorialOverlay from '@/components/TutorialOverlay.vue';

const tgWebApp = window.Telegram.WebApp;

const data = ref({
  loading: Promise.all([
    useFetch('user'),
    useFetch('leaderboard'),
    useFetch('receipts/history'),
    useFetch('offers/index'),
    useFetch('notifications/index'),
    useFetch('tutorial/status')
  ])
    .then((arr) =>
      Promise.all(
        arr.concat(
          useFetch('receipts/history/restaurant', null, { restaurant_id: arr[0].favorite?.id })
        )
      )
    )
    .then((arr) => arr.map((item) => item.data.data || item.data))
});

const pages = {
  '/': MainPage,
  '/scan': ScanPage,
  '/review': ReviewPage
};

const { bus } = useEventBus();

const currentPath = ref('/');
const currentPage = computed(() => pages[currentPath.value]);
const transition = ref('fade');
const isTutorial = ref(false);

const activeTheme = computed(
  () => data.value.user?.theme || window.localStorage.getItem('theme') || 'white-pink'
);

watch(
  () => bus.value.get('currentPage'),
  ([val]) => (currentPage.value = val)
);

data.value.loading.then(([user, rating, history, offers, notifications, tutorial, favorite]) => {
  data.value = { user, rating, history, offers, notifications, tutorial, favorite };

  if (!data.value.user.avatar) {
    data.value.user.avatar = 'images/avatar.png';
  }
});

function onLoad() {
  if (!data.value.tutorial.tutorial_skipped && !data.value.tutorial.tutorial_completed) {
    setTutorial(true);
  }
}

function setTutorial(value) {
  isTutorial.value = value;
}

onMounted(() => {
  window.location.hash = currentPath.value;
  tgWebApp.BackButton.hide();

  tgWebApp.BackButton.onClick(() => {
    window.history.back();
  });

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash.slice(1);
    if (currentPath.value == '/') {
      tgWebApp.BackButton.hide();
    } else {
      tgWebApp.BackButton.show();
    }
  });
});

watch(
  () => bus.value.get('setTutorial'),
  ([val]) => setTutorial(val)
);
</script>

<template>
  <main :class="['app', activeTheme, { 'tutorial-active': isTutorial }]">
    <Transition :name="transition" @after-leave="transition = 'slide-in'">
      <Suspense @resolve="onLoad">
        <component
          :is="currentPage"
          class="page"
          v-model:data="data"
          v-model:is-tutorial="isTutorial"
        />

        <template #fallback>
          <LoadingScreen :active-theme />
        </template>
      </Suspense>
    </Transition>
    <Transition name="fade">
      <TutorialOverlay
        v-if="isTutorial"
        v-model:user-data="data.user"
        v-model:tutorial-completed="data.tutorial.tutorial_completed"
        :history-empty="!data.history.length"
      />
    </Transition>
    <svg>
      <defs>
        <linearGradient id="gradient-main" x1="0" y1="0" x2="0" y2="100%">
          <stop stop-color="var(--theme-main-light)" />
          <stop offset="1" stop-color="var(--theme-main)" />
        </linearGradient>
      </defs>
    </svg>
  </main>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate 0.3s;
  position: absolute;
}

.slide-in-enter-from {
  translate: 0 100%;
}

.slide-in-leave-to {
  translate: 0 -100%;
}
</style>
