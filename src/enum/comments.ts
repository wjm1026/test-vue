export enum CommentRating {
  Good = 'good',
  Bad = 'bad',
}

export enum CommentExtractType {
  Unchecked = 'unchecked',
  All = 'all',
  NgWord = 'ng_word',
  Reported = 'reported',
}

export enum CommentType {
  All = 'all',
  Display = 'display',
  Hidden = 'hidden',
  None = 'none',
}

export enum CommentSortKey {
  ReviewId = 'reviewId',
  Comment = 'comment',
  Rating = 'rating',
  CreatedAt = 'createdAt',
  ProjectId = 'projectId',
  UserId = 'userId',
}
