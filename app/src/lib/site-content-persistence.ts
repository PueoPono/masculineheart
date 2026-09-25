import type { LessonContent, SiteContent } from '@/lib/site-content'

export const SITE_CONTENT_OVERRIDE_KEY = 'mhq_site_content_overrides_v1'
export const SITE_REFERENCE_NOTES_KEY = 'mhq_site_reference_notes_v1'

export type ReferenceNotes = Record<string, string>

export type SiteContentOverrides = {
  landing?: Partial<SiteContent['landing']>
  portal?: Partial<SiteContent['portal']>
  locked?: Partial<SiteContent['locked']>
  complete?: Partial<SiteContent['complete']>
  questionnaire?: Partial<SiteContent['questionnaire']>
  shell?: Partial<SiteContent['shell']>
  lessons?: Array<Partial<LessonContent> & { id: string }>
}

export type SiteContentDocument = {
  overrides: SiteContentOverrides
  referenceNotes: ReferenceNotes
  updatedAt?: string | null
  updatedBy?: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function sanitizeLessonOverride(value: unknown): (Partial<LessonContent> & { id: string }) | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id.trim()) return null

  const lesson: Partial<LessonContent> & { id: string } = { id: value.id }

  if (typeof value.dayNumber === 'number') lesson.dayNumber = value.dayNumber
  if (typeof value.arc === 'string') lesson.arc = value.arc as LessonContent['arc']
  if (typeof value.stepLabel === 'string') lesson.stepLabel = value.stepLabel
  if (typeof value.title === 'string') lesson.title = value.title
  if (typeof value.slug === 'string') lesson.slug = value.slug
  if (typeof value.theme === 'string') lesson.theme = value.theme
  if (typeof value.rhythmHeading === 'string') lesson.rhythmHeading = value.rhythmHeading
  if (typeof value.adminUnlockedNote === 'string') lesson.adminUnlockedNote = value.adminUnlockedNote
  if (typeof value.videoLabel === 'string') lesson.videoLabel = value.videoLabel
  if (typeof value.videoHeading === 'string') lesson.videoHeading = value.videoHeading
  if (typeof value.videoUrl === 'string') lesson.videoUrl = value.videoUrl
  if (typeof value.videoSupport === 'string') lesson.videoSupport = value.videoSupport
  if (typeof value.markVideoCompleteLabel === 'string') lesson.markVideoCompleteLabel = value.markVideoCompleteLabel
  if (typeof value.videoCompleteSavedLabel === 'string') lesson.videoCompleteSavedLabel = value.videoCompleteSavedLabel
  if (typeof value.completeLessonLabel === 'string') lesson.completeLessonLabel = value.completeLessonLabel
  if (typeof value.completeFinalLessonLabel === 'string') lesson.completeFinalLessonLabel = value.completeFinalLessonLabel
  if (typeof value.supportingTextHeading === 'string') lesson.supportingTextHeading = value.supportingTextHeading
  if (isStringArray(value.supportingPoints)) lesson.supportingPoints = value.supportingPoints
  if (typeof value.integrationHeading === 'string') lesson.integrationHeading = value.integrationHeading
  if (typeof value.integrationBody === 'string') lesson.integrationBody = value.integrationBody
  if (typeof value.practiceHeading === 'string') lesson.practiceHeading = value.practiceHeading
  if (typeof value.practice === 'string') lesson.practice = value.practice
  if (typeof value.reflectionPromptsHeading === 'string') lesson.reflectionPromptsHeading = value.reflectionPromptsHeading
  if (typeof value.promptLabelPrefix === 'string') lesson.promptLabelPrefix = value.promptLabelPrefix
  if (isStringArray(value.prompts)) lesson.prompts = value.prompts
  if (typeof value.journalPromptHeading === 'string') lesson.journalPromptHeading = value.journalPromptHeading
  if (typeof value.journalPrompt === 'string') lesson.journalPrompt = value.journalPrompt
  if (typeof value.previousLessonLabel === 'string') lesson.previousLessonLabel = value.previousLessonLabel
  if (typeof value.backToPortalLabel === 'string') lesson.backToPortalLabel = value.backToPortalLabel
  if (typeof value.nextLessonLabel === 'string') lesson.nextLessonLabel = value.nextLessonLabel

  return lesson
}

function sanitizeSection<T extends Record<string, string | unknown>>(value: unknown, allowedKeys: string[]) {
  if (!isRecord(value)) return undefined
  const output: Record<string, unknown> = {}
  for (const key of allowedKeys) {
    if (key in value) output[key] = value[key]
  }
  return output as Partial<T>
}


function sanitizeQuestionnaireFields(value: unknown): SiteContent['questionnaire']['fields'] | undefined {
  if (!Array.isArray(value)) return undefined
  return value
    .filter(isRecord)
    .map((field): SiteContent['questionnaire']['fields'][number] | null => {
      if (typeof field.id !== 'string' || typeof field.label !== 'string' || typeof field.type !== 'string') return null
      const type: SiteContent['questionnaire']['fields'][number]['type'] = field.type === 'textarea' || field.type === 'choice' ? field.type : 'text'
      return {
        id: field.id,
        label: field.label,
        type,
        options: isStringArray(field.options) ? field.options : undefined,
      }
    })
    .filter((field): field is SiteContent['questionnaire']['fields'][number] => !!field)
}

export function sanitizeSiteContentOverrides(value: unknown): SiteContentOverrides {
  if (!isRecord(value)) return {}

  const lessons = Array.isArray(value.lessons)
    ? value.lessons.map(sanitizeLessonOverride).filter((entry): entry is Partial<LessonContent> & { id: string } => !!entry)
    : undefined

  return {
    landing: sanitizeSection<SiteContent['landing']>(value.landing, [
      'navEyebrow',
      'navLabel',
      'heroEyebrow',
      'heroTitle',
      'heroBody',
      'heroSupport',
      'primaryCta',
      'secondaryCta',
      'tertiaryCta',
      'purchaseHeading',
      'overviewCards',
      'brandEyebrow',
      'pageTitle',
      'journeyDescription',
      'quoteLine1',
      'quoteLine2',
      'purchaseBody',
      'portalLinkLabel',
      'journeyEyebrow',
      'journeyBody',
      'previewEyebrow',
      'previewTitle',
      'previewIntroLine1',
      'previewIntroLine2',
    ]),
    portal: sanitizeSection<SiteContent['portal']>(value.portal, [
      'eyebrow',
      'title',
      'adminUnlockedNote',
      'progressHeading',
      'completedLessonsLabel',
      'dripHeading',
      'dripBody',
      'dripSupport',
      'nextAvailableEyebrow',
      'nextAvailableBody',
      'nextAvailableCta',
      'allLessonsOpenBody',
      'mapHeading',
      'mapBody',
      'integrationHeading',
      'integrationBody',
      'integrationAdminBypass',
      'trackLabels',
      'trackTitles',
      'trackDaysLabels',
      'trackStatusLabel',
      'trackNotes',
    ]),
    locked: sanitizeSection<SiteContent['locked']>(value.locked, ['eyebrow', 'title', 'body', 'cardHeading', 'cardBody', 'backToPortalLabel', 'loadingDetail', 'missingSessionDetail', 'missingPreviousDetail', 'progressLoadErrorDetail', 'videoNotCompleteDetail', 'unlockReadyDetail', 'savedWithoutNextDetail', 'ceremonyEyebrow', 'ceremonyTitle', 'ceremonyBody']),
    complete: sanitizeSection<SiteContent['complete']>(value.complete, ['eyebrow', 'title', 'body', 'cardHeading', 'cardBody', 'backToPortalLabel', 'loadingDetail', 'missingSessionDetail', 'missingPreviousDetail', 'progressLoadErrorDetail', 'videoNotCompleteDetail', 'unlockReadyDetail', 'savedWithoutNextDetail', 'ceremonyEyebrow', 'ceremonyTitle', 'ceremonyBody']),
    questionnaire: (() => {
      const section = sanitizeSection<SiteContent['questionnaire']>(value.questionnaire, ['eyebrow', 'title', 'introLines', 'quote', 'fields', 'closingBody', 'saveButton', 'savingButton', 'submitButton', 'submitAgainButton', 'submittingButton', 'returnToCourseLabel', 'choosePlaceholder', 'progressSuffix', 'loadingStatus', 'localOnlyStatus', 'draftStatus', 'submittedStatus', 'submittedNotifiedStatus', 'savedStatus', 'alreadySubmittedStatus', 'loadErrorStatus', 'saveErrorStatus', 'submitErrorStatus'])
      if (!section) return undefined
      if (section.introLines && !isStringArray(section.introLines)) delete section.introLines
      const fields = sanitizeQuestionnaireFields(section.fields)
      if (fields) section.fields = fields
      else if (section.fields) delete section.fields
      return section
    })(),
    shell: sanitizeSection<SiteContent['shell']>(value.shell, ['homeIntroLinkLabel', 'portalLoginTitle', 'portalLoginCta', 'portalNotEnrolledTitle', 'portalBackToLandingLabel', 'portalLoadingLabel', 'portalSignedInPrefix', 'portalCompletionTotalLabel', 'portalCompletionMapLabel', 'portalCompletionMapBody', 'portalLessonsCompleteSuffix', 'portalSectionCompleteSuffix', 'portalAvailableStatus', 'portalCompleteStatus', 'portalLockedStatus', 'portalAdminOpenStatus', 'portalUnlocksPrefix', 'lessonMissingTitle', 'lessonMissingBody', 'lessonMissingCta', 'lessonRefreshLabel', 'lessonDefaultSupportingHeading', 'lessonDefaultVideoHeading', 'lessonDefaultIntroVideoHeading', 'lessonDefaultMarkVideoCompleteLabel', 'lessonDefaultVideoCompleteSavedLabel', 'lessonDefaultCompleteLessonLabel', 'lessonDefaultCompleteFinalLessonLabel', 'lessonReflectionPlaceholder', 'lessonDefaultSaveReflectionLabel', 'lessonSavingLabel', 'lessonNextAvailableAfterCompletion', 'lessonNextAvailableAfterUnlock', 'lessonReflectionSavedStatus', 'lessonReflectionSaveErrorStatus', 'lessonCompletionSaveErrorStatus', 'lessonFinalReflectionEmailErrorStatus']),
    lessons,
  }
}

export function sanitizeReferenceNotes(value: unknown): ReferenceNotes {
  if (!isRecord(value)) return {}
  const output: ReferenceNotes = {}
  for (const [key, note] of Object.entries(value)) {
    if (typeof note === 'string') output[key] = note
  }
  return output
}

export function sanitizeSiteContentDocument(value: unknown): SiteContentDocument {
  if (!isRecord(value)) {
    return { overrides: {}, referenceNotes: {} }
  }

  return {
    overrides: sanitizeSiteContentOverrides(value.overrides),
    referenceNotes: sanitizeReferenceNotes(value.referenceNotes),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    updatedBy: typeof value.updatedBy === 'string' ? value.updatedBy : null,
  }
}
