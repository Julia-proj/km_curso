type CourseStatus = 'live' | 'prelaunch'

/**
 * Bonus lesson rollout:
 *  - 'hidden' — nobody sees the Бонусы section.
 *  - 'soon'   — teaser visible ("скоро"), but claims are NOT accepted yet
 *               (so no one gets approved into an empty lesson while the video
 *               is still being filmed).
 *  - 'live'   — full flow: students submit claims, Elena approves, lesson opens.
 * Read on the client, so it must use the NEXT_PUBLIC_ prefix.
 */
type BonusStatus = 'hidden' | 'soon' | 'live'

interface FeatureFlags {
  courseStatus: CourseStatus
  bonusStatus: BonusStatus
  aiDiagnostics: boolean
  emailNotifications: boolean
  dashboard: boolean
}

export const featureFlags: FeatureFlags = {
  courseStatus: (process.env.COURSE_STATUS as CourseStatus) || 'prelaunch',
  bonusStatus: (process.env.NEXT_PUBLIC_BONUS_STATUS as BonusStatus) || 'soon',
  aiDiagnostics: true,
  emailNotifications: false,
  dashboard: true,
}

export function isCourseActive(): boolean {
  return featureFlags.courseStatus === 'live'
}

/** Bonus section is shown in the dashboard (teaser or full). */
export function isBonusVisible(): boolean {
  return featureFlags.bonusStatus !== 'hidden'
}

/** Bonus flow is fully open: claims accepted, approvals unlock the lesson. */
export function isBonusLive(): boolean {
  return featureFlags.bonusStatus === 'live'
}