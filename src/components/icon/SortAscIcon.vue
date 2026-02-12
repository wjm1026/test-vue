<template>
  <svg
    class="rotate-180"
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.49938 3V8.585L3.05938 6.145C2.86438 5.95 2.54438 5.95 2.34937 6.145C2.15438 6.34 2.15438 6.655 2.34937 6.85L5.64438 10.145C5.83938 10.34 6.15437 10.34 6.34937 10.145L9.64438 6.85C9.83938 6.655 9.83938 6.34 9.64438 6.145C9.44938 5.95 9.13437 5.95 8.93937 6.145L6.49937 8.585V3C6.49937 2.725 6.27437 2.5 5.99938 2.5C5.72438 2.5 5.49938 2.725 5.49938 3Z"
      :fill="color"
    />
  </svg>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
  }>(),
  {
    color: '#4D4D4D',
  },
)
</script>
