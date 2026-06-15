/**
 * Bonus lesson config.
 *
 * The deal: a student shares the course on Instagram (story/reel/post) and tags
 * the studio. Elena sees the tag, opens the admin panel and approves the claim.
 * Only an approved claim unlocks the bonus lesson below.
 *
 * The video is NOT ready yet. Leave `youtubeId` empty and the bonus page shows a
 * "video coming soon" placeholder. When the peeling lesson is filmed:
 *   1. paste the YouTube id into `BONUS_LESSON.youtubeId`
 *   2. set NEXT_PUBLIC_BONUS_STATUS=live
 * and the whole flow goes live with no other code changes.
 */

/** Instagram handle students must tag to claim the bonus. */
export const BONUS_INSTAGRAM_HANDLE = '@hairlab_aleksandrova.el_'
export const BONUS_INSTAGRAM_URL =
  'https://www.instagram.com/hairlab_aleksandrova.el_/'

export const BONUS_LESSON = {
  title: 'Бонусный урок: пилинги',
  description:
    'Как правильно делать пилинг кожи головы дома: пошагово, без ошибок и без вреда для волос.',
  /** Paste the YouTube id here when the video is ready. Empty = "скоро". */
  youtubeId: '',
}

export type BonusClaimStatus = 'pending' | 'approved' | 'rejected'
