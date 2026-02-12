<template>
  <LayoutMain
    title="プロジェクト管理"
    :total="projectList?.total"
    :show-pagination="true"
    :page="page"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="flex h-full flex-col gap-8">
      <AddButton @click="projectAdd" />
      <div class="flex min-h-0 flex-1 flex-col gap-6">
        <SearchInput placeholder="プロジェクト名、商品名で絞り込み" v-model="searchKeyword" />
        <div class="flex flex-1 flex-col gap-3 overflow-auto">
          <ElText class="text-gray800 self-start text-xs font-bold">
            全{{ projectList?.total }}プロジェクト
          </ElText>
          <ProjectsTable
            class="h-full"
            :data="projectList?.projects"
            :isLoading="isLoading"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      </div>
    </div>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useProjectsPage } from './useProjectsPage'

import AddButton from '@/components/button/AddButton.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import ProjectsTable from '@/components/view/projects/ProjectsTable.vue'

const {
  projectList,
  page,
  searchKeyword,
  isLoading,
  pageChange,
  projectAdd,
  sortField,
  sortOrder,
} = useProjectsPage()
</script>
