<template>
  <div class="space-y-4">
    <ElText class="text-[16px] font-bold text-gray800 block">ダウンロード</ElText>
    <div class="flex items-center">
      <WhiteButton
        label="レポート（印刷）"
        className="w-[177px] h-10 text-primary600 border-primary500"
        :loading="false"
        @click="handlePDFDownload"
      >
        <template #prefix>
          <ElIcon size="20" class="mr-[6px]">
            <UploadIcon />
          </ElIcon>
        </template>
      </WhiteButton>
      <WhiteButton
        label="評価データ（CSV）"
        className="w-[177px] h-10 text-primary600 border-primary500 ml-2"
        :loading="isDownloading"
        @click="handleCSVDownload"
      >
        <template #prefix>
          <ElIcon size="20" class="mr-[6px]">
            <UploadIcon />
          </ElIcon>
        </template>
      </WhiteButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportCSVDownload } from '@/hooks/useReportCSVDownload'

interface Props {
  projectId?: number
}

const props = defineProps<Props>()

const { isDownloading, downloadCSV } = useReportCSVDownload()

const handlePDFDownload = () => {
  window.print()
}

const handleCSVDownload = async () => {
  if (!props.projectId) return

  await downloadCSV(props.projectId)
}
</script>
