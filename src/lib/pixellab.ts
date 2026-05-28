/**
 * Pixellab API Client
 * https://www.pixellab.ai/pixellab-api
 *
 * Temporary sprite generation until we train our own model.
 */

const PIXELLAB_API_V1 = 'https://api.pixellab.ai/v1'
const PIXELLAB_API_V2 = 'https://api.pixellab.ai/v2'

export type PixellabView = 'side' | 'low top-down' | 'high top-down'
export type PixellabDirection = 'south' | 'south-west' | 'west' | 'north-west' | 'north' | 'north-east' | 'east' | 'south-east'
export type PixellabImageSize = { width: number; height: number }
export type SkeletonSize = 16 | 32 | 64 | 128 | 256

// API response types - flexible to handle different formats
export interface PixellabUsage {
  type?: string
  usd: number
}

export interface PixellabImage {
  base64: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PixellabResponse {
  image: string | PixellabImage | any
  usage: number | PixellabUsage | any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PixellabAnimationResponse {
  images: (string | PixellabImage | any)[]
  usage: number | PixellabUsage | any
}

export interface SkeletonKeypoint {
  x: number
  y: number
  label: string
}

// ─────────────────────────────────────────────────────────────
// Generate Image (Pixflux) - Text to pixel art
// ─────────────────────────────────────────────────────────────
export interface GeneratePixfluxOptions {
  description: string
  width: number   // 32-400
  height: number  // 32-400
  negativeDescription?: string
  noBackground?: boolean
  initImage?: string      // base64, for variations
  colorPalette?: string   // base64, force palette
  textGuidance?: number   // 1-20, default 8
  imageGuidance?: number  // 1-20
  seed?: number
}

export async function generatePixflux(
  apiKey: string,
  options: GeneratePixfluxOptions
): Promise<PixellabResponse> {
  const body: Record<string, unknown> = {
    description: options.description,
    image_size: { width: options.width, height: options.height },
  }

  if (options.negativeDescription) body.negative_description = options.negativeDescription
  if (options.noBackground) body.no_background = true
  if (options.initImage) body.init_image = { base64: options.initImage }
  if (options.colorPalette) body.color_image = { base64: options.colorPalette }
  if (options.textGuidance) body.text_guidance_scale = options.textGuidance
  if (options.imageGuidance) body.image_guidance_scale = options.imageGuidance
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/generate-image-pixflux', body)
}

// ─────────────────────────────────────────────────────────────
// Generate Image (Bitforge) - Style transfer pixel art
// ─────────────────────────────────────────────────────────────
export interface GenerateBitforgeOptions {
  description: string
  width: number   // max 200
  height: number  // max 200
  styleImage?: string     // base64, reference style
  initImage?: string      // base64, for variations
  noBackground?: boolean
  textGuidance?: number
  seed?: number
}

export async function generateBitforge(
  apiKey: string,
  options: GenerateBitforgeOptions
): Promise<PixellabResponse> {
  const body: Record<string, unknown> = {
    description: options.description,
    image_size: { width: options.width, height: options.height },
  }

  if (options.styleImage) body.style_image = options.styleImage
  if (options.initImage) body.init_image = options.initImage
  if (options.noBackground) body.no_background = true
  if (options.textGuidance) body.text_guidance_scale = options.textGuidance
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/generate-image-bitforge', body)
}

// ─────────────────────────────────────────────────────────────
// Animate with Text (v1) - 4-frame animation, 64x64 only
// ─────────────────────────────────────────────────────────────
export interface AnimateWithTextOptions {
  description: string
  action: string           // e.g. "walking", "attacking"
  referenceImage: string   // base64
  view?: PixellabView
  direction?: PixellabDirection
  noBackground?: boolean
  colorPalette?: string
  textGuidance?: number
  seed?: number
}

export async function animateWithText(
  apiKey: string,
  options: AnimateWithTextOptions
): Promise<PixellabAnimationResponse> {
  const body: Record<string, unknown> = {
    description: options.description,
    action: options.action,
    image_size: { width: 64, height: 64 },
    reference_image: { base64: options.referenceImage },
  }

  if (options.view) body.view = options.view
  if (options.direction) body.direction = options.direction
  if (options.noBackground) body.no_background = true
  if (options.colorPalette) body.color_image = options.colorPalette
  if (options.textGuidance) body.text_guidance_scale = options.textGuidance
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/animate-with-text', body)
}

// ─────────────────────────────────────────────────────────────
// Animate with Text V3 - Variable frames (4-16), up to 256x256
// Async background job - better quality, more frames
// ─────────────────────────────────────────────────────────────
export interface AnimateWithTextV3Options {
  firstFrame: string       // base64
  action: string           // e.g. "running forward", "swinging sword"
  width: number            // max 256
  height: number           // max 256
  frameCount?: number      // 4-16, default varies by size
  noBackground?: boolean
  seed?: number
}

export interface AnimateV3StartResponse {
  backgroundJobId: string
}

export interface AnimateV3StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  last_response?: {
    images: (string | { base64: string })[]
  }
  error?: string
  usage?: number | { usd: number }
}

export async function animateWithTextV3Start(
  apiKey: string,
  options: AnimateWithTextV3Options
): Promise<AnimateV3StartResponse> {
  // V3 API infers size from first_frame image, not explicit image_size
  // Pixel budget: width * height * frameCount <= 524288
  const maxFrames = Math.min(16, Math.floor(524288 / (options.width * options.height)))
  const frameCount = Math.min(options.frameCount || 8, maxFrames)

  const body: Record<string, unknown> = {
    first_frame: { base64: options.firstFrame },
    action: options.action,
    frame_count: frameCount,
  }

  if (options.noBackground) body.no_background = true
  if (options.seed !== undefined) body.seed = options.seed

  const response = await pixellabRequestV2<{ background_job_id: string }>(
    apiKey,
    '/animate-with-text-v3',
    body
  )

  return { backgroundJobId: response.background_job_id }
}

export async function animateV3CheckStatus(
  apiKey: string,
  jobId: string
): Promise<AnimateV3StatusResponse> {
  const res = await fetch(`${PIXELLAB_API_V2}/background-jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!res.ok) {
    throw new PixellabError(res.status, await res.text())
  }

  return res.json()
}


// ─────────────────────────────────────────────────────────────
// Animate with Skeleton - Animation from keypoints
// Supports: 16, 32, 64, 128, 256 (unlike text which is 64 only)
// ─────────────────────────────────────────────────────────────
export interface AnimateWithSkeletonOptions {
  size: SkeletonSize
  referenceImage: string   // base64
  skeletonKeypoints: SkeletonKeypoint[][]  // array of keypoint arrays per frame
  noBackground?: boolean
  seed?: number
}

export async function animateWithSkeleton(
  apiKey: string,
  options: AnimateWithSkeletonOptions
): Promise<PixellabAnimationResponse> {
  const body: Record<string, unknown> = {
    image_size: { width: options.size, height: options.size },
    reference_image: { base64: options.referenceImage },
    skeleton_keypoints: options.skeletonKeypoints,
  }

  if (options.noBackground) body.no_background = true
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/animate-with-skeleton', body)
}

// ─────────────────────────────────────────────────────────────
// Estimate Skeleton - Get keypoints from character image
// ─────────────────────────────────────────────────────────────
export interface EstimateSkeletonOptions {
  size: SkeletonSize
  image: string  // base64
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function estimateSkeleton(
  apiKey: string,
  options: EstimateSkeletonOptions
): Promise<{ skeleton: SkeletonKeypoint[]; usage: any }> {
  const body = {
    image_size: { width: options.size, height: options.size },
    image: { base64: options.image },
  }

  return pixellabRequest(apiKey, '/estimate-skeleton', body)
}

// ─────────────────────────────────────────────────────────────
// Rotate - Change character/object orientation
// ─────────────────────────────────────────────────────────────
export interface RotateOptions {
  size: SkeletonSize
  fromImage: string           // base64
  fromDirection: PixellabDirection
  toDirection: PixellabDirection
  noBackground?: boolean
  seed?: number
}

export async function rotate(
  apiKey: string,
  options: RotateOptions
): Promise<PixellabResponse> {
  const body: Record<string, unknown> = {
    image_size: { width: options.size, height: options.size },
    from_image: options.fromImage,
    from_direction: options.fromDirection,
    to_direction: options.toDirection,
  }

  if (options.noBackground) body.no_background = true
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/rotate', body)
}

// ─────────────────────────────────────────────────────────────
// Inpaint - Edit existing pixel art
// ─────────────────────────────────────────────────────────────
export interface InpaintOptions {
  description: string
  width: number   // max 200
  height: number  // max 200
  image: string   // base64, original image
  mask: string    // base64, white = edit area
  noBackground?: boolean
  textGuidance?: number
  seed?: number
}

export async function inpaint(
  apiKey: string,
  options: InpaintOptions
): Promise<PixellabResponse> {
  const body: Record<string, unknown> = {
    description: options.description,
    image_size: { width: options.width, height: options.height },
    inpainting_image: options.image,
    mask_image: options.mask,
  }

  if (options.noBackground) body.no_background = true
  if (options.textGuidance) body.text_guidance_scale = options.textGuidance
  if (options.seed !== undefined) body.seed = options.seed

  return pixellabRequest(apiKey, '/inpaint', body)
}

// ─────────────────────────────────────────────────────────────
// Get Balance
// ─────────────────────────────────────────────────────────────
export async function getBalance(apiKey: string): Promise<{ balance: number }> {
  const res = await fetch(`${PIXELLAB_API_V1}/balance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!res.ok) {
    throw new PixellabError(res.status, await res.text())
  }

  return res.json()
}

// ─────────────────────────────────────────────────────────────
// Shared request helper
// ─────────────────────────────────────────────────────────────
class PixellabError extends Error {
  constructor(public status: number, public body: string) {
    super(`Pixellab API error ${status}: ${body}`)
    this.name = 'PixellabError'
  }
}

async function pixellabRequest<T>(
  apiKey: string,
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${PIXELLAB_API_V1}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new PixellabError(res.status, errorBody)
  }

  return res.json()
}

async function pixellabRequestV2<T>(
  apiKey: string,
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${PIXELLAB_API_V2}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new PixellabError(res.status, errorBody)
  }

  return res.json()
}

// ─────────────────────────────────────────────────────────────
// Utility: Convert base64 to data URL
// ─────────────────────────────────────────────────────────────
export function base64ToDataUrl(base64: string): string {
  return `data:image/png;base64,${base64}`
}

// ─────────────────────────────────────────────────────────────
// Utility: Convert image file/blob to base64
// ─────────────────────────────────────────────────────────────
export async function imageToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
