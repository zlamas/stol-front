<script setup>
import { computed, ref, onMounted, useTemplateRef, watch } from 'vue';
import useEventBus from '@/eventBus';
import { wait } from '@/funcs';

import RatingView from '@/views/RatingView.vue';
import OffersView from '@/views/OffersView.vue';
import MainView from '@/views/MainView.vue';
import HistoryView from '@/views/HistoryView.vue';
import ProfileView from '@/views/ProfileView.vue';
import NavBar from '@/components/NavBar.vue';

const views = {
  rating: RatingView,
  offers: OffersView,
  main: MainView,
  history: HistoryView,
  profile: ProfileView,
};

const { bus } = useEventBus();
const data = defineModel('data');

const content = useTemplateRef('content');
const currentView = ref('main');
const viewRefs = ref({});
const targetSet = ref(false);

const activeIndex = computed({
  get() { return Object.keys(views).indexOf(currentView.value); },
  set(newValue) { currentView.value = Object.keys(views)[newValue]; }
});

onMounted(() => {
  let scrollPos = content.value.scrollLeft;
  let isDragging = false;

  content.value.addEventListener('scroll', () => {
    if (!content.value) return;
    const scrollAmount = content.value.scrollLeft - scrollPos;
    scrollPos = content.value.scrollLeft;
    if (isDragging || targetSet.value) return;

    const index = scrollPos / content.value.offsetWidth;
    activeIndex.value = scrollAmount > 0 ? Math.ceil(index) : Math.floor(index);
  });

  content.value.addEventListener('touchstart', () => {
    isDragging = true;
    targetSet.value = false;
  });

  content.value.addEventListener('touchend', () => {
    isDragging = false;
  });

  viewRefs.value[currentView.value].view.scrollIntoView();
});

watch(
  () => bus.value.get('currentView'),
  ([val]) => {
    currentView.value = val;
    targetSet.value = true;
  }
);

watch(
  () => currentView.value,
  (view) => {
    if (targetSet.value) {
      viewRefs.value[view].view.scrollIntoView({ behavior: 'smooth' });
    }
  }
);

if (data.value.loading) {
  await Promise.all([
    data.value.loading,
    wait(3000)
  ]);
  data.value.loading = null;
}
</script>

<template>
  <div class="main">
    <div ref="content" class="content">
      <component
        v-for="(view, name) in views"
        :ref="(el) => viewRefs[name] = el"
        :key="name"
        :is="view"
        :class="`view view--${name}`"
        v-model:data="data"
      />
    </div>
    <NavBar :active-index />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/mixins" as *;

.main {
  @include grid;
  height: 100%;
  grid-template-rows: 1fr auto;
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
}
</style>
