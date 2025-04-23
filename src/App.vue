<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Rating from './views/Rating.vue'
import Offers from './views/Offers.vue'
import Main from './views/Main.vue'
import History from './views/History.vue'
import Profile from './views/Profile.vue'
import Loading from './views/Loading.vue'
import Scan from './views/Scan.vue'
import Review from './views/Review.vue'
import _userData from '@/user.json'

const views = {
  rating: Rating,
  offers: Offers,
  main: Main,
  history: History,
  profile: Profile,
}

const routes = {
  '/': null,
  '/scan': Scan,
  '/review': Review,
}

const currentViewName = ref('main');
const currentView = computed(() => views[currentViewName.value]);
const activeItem = computed(() => Object.keys(views).indexOf(currentViewName.value));

const currentPath = ref(window.location.hash);
const currentRoute = computed(() => routes[currentPath.value.slice(1) || '/']);

const userData = reactive(_userData);

const style = computed(() => ({
  '--active-item': activeItem.value,
  '--color-main': `var(--gamma${userData.gamma}-main)`,
  '--color-main-light': `var(--gamma${userData.gamma}-main-light)`,
  '--color-bg': `var(--gamma${userData.gamma}-bg)`,
  '--color-main-gradient': 'linear-gradient(var(--color-main-light), var(--color-main))',
}));

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
</script>

<template>
  <Suspense>
    <main :class="['main', `main--${currentViewName}`]" :style>
      <component
        :is="currentView"
        :class="`content--${currentViewName}`"
        v-model="userData" />
      <Navbar v-model="currentViewName" />

      <component :is="currentRoute" />
    </main>

    <template #fallback>
      <Loading :style />
    </template>
  </Suspense>
</template>
