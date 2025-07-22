<script>
import { computed, onMounted, ref, watch } from 'vue'
import useFetch from '@/fetch'
import useEventBus from '@/eventBus'
import testData from '@/test-data.json'

import Rating from '@/views/Rating.vue'
import Offers from '@/views/Offers.vue'
import Main from '@/views/Main.vue'
import History from '@/views/History.vue'
import Profile from '@/views/Profile.vue'

import Loading from '@/views/Loading.vue'
import Scan from '@/views/Scan.vue'
import Review from '@/views/Review.vue'
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    Loading,
    NavBar,
    Scan,
    Review,
  },
  setup() {
    const data = ref({
      ...testData,
      loading: Promise.all([
        useFetch('user'),
        useFetch('leaderboard'),
        useFetch('receipts/history')
      ]).then((arr) => Promise.all(arr.concat(
        useFetch(
          'receipts/history/restaurant',
          { restaurant_id: arr[0].favorite?.id },
        )
      )))
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

    const { bus } = useEventBus();

    const currentView = ref('main');
    const activeIndex = computed({
      get() { return Object.keys(views).indexOf(currentView.value); },
      set(newValue) { currentView.value = Object.keys(views)[newValue]; }
    });

    const targetSet = ref(false);

    const currentPath = ref(window.location.hash);
    const currentRoute = computed(() => routes[currentPath.value.slice(1) || '/']);

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

    watch(
      () => bus.value.get('currentView'),
      (val) => {
        [currentView.value] = val;
        targetSet.value = true;
      }
    );

    data.value.loading.then(([user, rating, history, favorite]) => {
      Object.assign(data.value, {
        user: user.data.data,
        rating: rating.data.data,
        history: history.data.data,
        favorite: favorite.data.data
      });
      if (!data.value.user.avatar) {
        data.value.user.avatar = 'images/avatar.png';
      }
    });

    return { data, activeTheme, views, currentView, activeIndex, targetSet, currentRoute };
  },
  methods: {
    onLoad() {
      this.$nextTick(() => {
        const content = this.$refs.content;
        let scrollPos = content.scrollLeft;
        let isDragging = false;

        content.addEventListener('scroll', () => {
          const direction = (content.scrollLeft < scrollPos) ? 'left' : 'right';
          scrollPos = content.scrollLeft;
          if (isDragging || this.targetSet) return;

          const index = scrollPos / content.offsetWidth;
          this.activeIndex = direction == 'left' ? Math.floor(index) : Math.ceil(index);
        });
        content.addEventListener('touchstart', () => { isDragging = true; this.targetSet = false; });
        content.addEventListener('touchend', () => { isDragging = false; });
      });
    }
  },
  watch: {
    activeIndex(newValue) {
      if (this.targetSet) this.$refs.viewRef[newValue].$el.scrollIntoView({ behavior: 'smooth' });
    },
  }
}
</script>

<template>
  <Transition name="fade">
    <Suspense @resolve="onLoad">
      <main :class="`main ${activeTheme}`">
        <div ref="content" class="content">
          <component
            v-for="(view, name) in views"
            v-if="data.loading == null"
            ref="viewRef"
            :is="view"
            :class="`view view--${name}`"
            tabindex="0"
            :autofocus="name == currentView"
            v-model:data="data" />
        </div>
        <NavBar v-model:data="data" :active-index />
        <component :is="currentRoute" />
        <svg height="0">
          <defs>
            <linearGradient id="gradient-main" x1="0" y1="0" x2="0" y2="100%">
              <stop stop-color="var(--theme-main-light)"/>
              <stop offset="1" stop-color="var(--theme-main)"/>
            </linearGradient>
          </defs>
        </svg>
      </main>

      <template #fallback>
        <Loading :active-theme />
      </template>
    </Suspense>
  </Transition>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.main {
  @include grid;
  position: fixed;
  inset: 0;
  grid-template-rows: 1fr auto;
  background: var(--theme-bg);
  color: var(--theme-20);
  font: 16px "Montserrat", sans-serif;
  letter-spacing: -0.02em;
}

.content {
  @include flex;
  overflow: auto;
  scroll-snap-type: x mandatory;
}

.view {
  min-width: 100%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  outline: 0;
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
</style>
