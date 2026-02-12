export const getCommentRatingLabel = (rating?: number | null): string => {
  if (rating === undefined || rating === null) return '-'
  return rating === 0 ? 'イマイチ' : 'よかった'
}
