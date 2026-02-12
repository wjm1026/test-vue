<template>
  <LayoutMain title="調査プロジェクト作成">
    <div class="pb-8">
      <ProjectsForm @successProjectSubmit="successProjectSubmit" />
    </div>
    <CreateProjectDialog
      v-if="createVisible"
      v-model="createVisible"
      :project="project"
      @closeDialog="() => (createVisible = false)"
    />
  </LayoutMain>
</template>
<script lang="ts" setup>
import { useProjectCreatePage } from './useProjectCreatePage'

const { createVisible, project, successProjectSubmit } = useProjectCreatePage()
</script>
