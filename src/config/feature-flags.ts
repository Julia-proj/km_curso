type CourseStatus = 'live' | 'prelaunch'

interface FeatureFlags {
  courseStatus: CourseStatus
  aiDiagnostics: boolean
  emailNotifications: boolean
  dashboard: boolean
}

export const featureFlags: FeatureFlags = {
  courseStatus: (process.env.COURSE_STATUS as CourseStatus) || 'prelaunch',
  aiDiagnostics: true,
  emailNotifications: false,
  dashboard: false,
}

export function isCourseActive(): boolean {
  return featureFlags.courseStatus === 'live'
}