<script setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  name: String,
  size: [Number, String],
});

const icons = import.meta.glob(`@/assets/icons/*.svg`);

const icon = computed(() =>
  defineAsyncComponent(() =>
    icons[`/src/assets/icons/${props.name}.svg`]()
  )
);
const iconSize = computed(() => {
  if (props.size) return { width: props.size, height: props.size };
  else return {};
});
</script>

<template>
  <component :is="icon" v-bind="iconSize" />
</template>
