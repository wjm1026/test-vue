import { computed } from 'vue'
import type { TableColumnCtx } from 'element-plus'

import type { Comments, ProductComments } from '@/api/types/reports'

interface RowViewModel {
  label: string
  maleCommentTitle: string
  maleDescription: string
  maleCommentIds: string
  maleDisplayOrder?: number
  femaleCommentTitle: string
  femaleDescription: string
  femaleCommentIds: string
  femaleDisplayOrder?: number
  displayOrder?: number
}

interface UseReportCommentsTableProps {
  data: ProductComments[]
}

export const useReportCommentsTable = (props: UseReportCommentsTableProps) => {
  const data = computed<RowViewModel[]>(() => {
    const result: RowViewModel[] = []
    props.data.forEach((row) => {
      const maxLength = Math.max(row.maleComments.length, row.femaleComments.length)
      for (let i = 0; i < maxLength; i++) {
        const maleComment = row.maleComments[i] || ({} as Comments)
        const femaleComment = row.femaleComments[i] || ({} as Comments)
        const maleDisplayOrder = (maleComment as Comments & { displayOrder?: number }).displayOrder
        const femaleDisplayOrder = (femaleComment as Comments & { displayOrder?: number })
          .displayOrder
        result.push({
          label: i === 0 ? row.label : '',
          maleCommentTitle: maleComment.title || '',
          maleDescription: maleComment.description || '',
          maleCommentIds: (maleComment.commentIds || '').replace(/,/g, ',\n'),
          maleDisplayOrder,
          femaleCommentTitle: femaleComment.title || '',
          femaleDescription: femaleComment.description || '',
          femaleCommentIds: (femaleComment.commentIds || '').replace(/,/g, ',\n'),
          femaleDisplayOrder,
          displayOrder: maleDisplayOrder ?? femaleDisplayOrder,
        })
      }
    })
    return result
  })

  const commentStartMeta = computed(() => {
    const meta: { start: number; rowspan: number }[] = []
    let currentIndex = 0

    props.data.forEach((row) => {
      const maxLength = Math.max(row.maleComments.length, row.femaleComments.length)
      if (maxLength === 0) return

      meta.push({ start: currentIndex, rowspan: maxLength })
      currentIndex += maxLength
    })

    return meta
  })

  const objectSpanMethod = ({
    rowIndex,
    columnIndex,
  }: {
    row: RowViewModel
    column: TableColumnCtx<RowViewModel>
    rowIndex: number
    columnIndex: number
  }) => {
    if (columnIndex === 0) {
      const startMeta = commentStartMeta.value.find((meta) => meta.start === rowIndex)
      if (startMeta) {
        const { rowspan } = startMeta

        return {
          rowspan,
          colspan: 1,
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }

  return { data, objectSpanMethod }
}
