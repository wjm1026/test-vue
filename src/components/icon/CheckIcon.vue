<template>
  <svg
    v-if="checked"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="check-icon--checked"
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      fill="white"
    />
    <path
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM17.2998 8.29004C16.9098 7.90014 16.2699 7.90007 15.8799 8.29004L10 14.1699L8.12012 12.29C7.73012 11.9 7.09996 11.9 6.70996 12.29C6.31996 12.68 6.31996 13.3102 6.70996 13.7002L9.2998 16.29C9.6898 16.68 10.32 16.68 10.71 16.29L17.2998 9.7002C17.6898 9.3102 17.6898 8.68004 17.2998 8.29004Z"
      class="check-icon__fill"
    />
  </svg>
  <svg
    v-else
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="check-icon--unchecked"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="white"
    />
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.88 8.29L10 14.17L8.12 12.29C7.73 11.9 7.1 11.9 6.71 12.29C6.32 12.68 6.32 13.31 6.71 13.7L9.3 16.29C9.69 16.68 10.32 16.68 10.71 16.29L17.3 9.7C17.69 9.31 17.69 8.68 17.3 8.29C16.91 7.9 16.27 7.9 15.88 8.29Z"
      class="check-icon__fill--unchecked"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    checked?: boolean
  }>(),
  {
    checked: false,
  },
)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.check-icon__fill {
  @apply fill-primary500;
}

.check-icon__fill--unchecked {
  @apply fill-gray400;
}
</style>
