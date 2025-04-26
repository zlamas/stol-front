<script setup>
import { computed, onMounted, ref } from 'vue'
import NavBar from './components/NavBar.vue'
import Rating from './views/Rating.vue'
import Offers from './views/Offers.vue'
import Main from './views/Main.vue'
import History from './views/History.vue'
import Profile from './views/Profile.vue'
import Loading from './views/Loading.vue'
import Scan from './views/Scan.vue'
import Review from './views/Review.vue'

const data = ref({
  user: null,
  history: null,
  favorite: null,
});

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

const activeTheme = computed(() => (data.value.user?.theme || 'white-pink'));

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
    <main :class="`main main--${currentViewName} ${activeTheme}`">
      <div class="content">
        <component
          :is="currentView"
          :class="`view view--${currentViewName}`"
          v-model="data" />
      </div>
      <NavBar v-model="currentViewName" :active-item />

      <component :is="currentRoute" />
    </main>

    <template #fallback>
      <Loading :class="activeTheme" v-model="data" />
    </template>
  </Suspense>
</template>
