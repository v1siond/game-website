import { NextRequest, NextResponse } from 'next/server'
import {
  generatePixflux,
  animateWithText,
  animateWithTextV3Start,
  animateV3CheckStatus,
  animateWithSkeleton,
  estimateSkeleton,
  getBalance,
  base64ToDataUrl,
  type SkeletonSize,
  type SkeletonKeypoint,
} from '@/lib/pixellab'

const PIXELLAB_API_KEY = process.env.PIXELLAB_API_KEY

export async function POST(request: NextRequest) {
  if (!PIXELLAB_API_KEY) {
    return NextResponse.json(
      { error: 'PIXELLAB_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { action, ...params } = body

    let result

    switch (action) {
      case 'generate': {
        const response = await generatePixflux(PIXELLAB_API_KEY, {
          description: params.description,
          width: params.width || 64,
          height: params.height || 64,
          noBackground: params.noBackground ?? true,
          initImage: params.initImage,
          seed: params.seed,
        })
        // Extract base64 from response - API returns {image: {base64: "..."}, usage: {usd: N}}
        const imageData = response.image
        const imageBase64 = typeof imageData === 'string'
          ? imageData
          : (imageData && typeof imageData === 'object' && 'base64' in imageData)
            ? (imageData as { base64: string }).base64
            : ''
        const usageData = response.usage
        const usageUsd = typeof usageData === 'number'
          ? usageData
          : (usageData && typeof usageData === 'object' && 'usd' in usageData)
            ? (usageData as { usd: number }).usd
            : 0
        result = {
          image: base64ToDataUrl(imageBase64),
          usage: usageUsd,
        }
        break
      }

      case 'animate': {
        const response = await animateWithText(PIXELLAB_API_KEY, {
          description: params.description,
          action: params.animationAction || 'idle',
          referenceImage: params.referenceImage,
          direction: params.direction || 'south-east',
          noBackground: params.noBackground ?? true,
          seed: params.seed,
        })
        // Handle images array - each could be string or {base64: "..."}
        const images = (response.images || []).map((img: unknown) => {
          if (typeof img === 'string') return base64ToDataUrl(img)
          if (img && typeof img === 'object' && 'base64' in img) {
            return base64ToDataUrl((img as { base64: string }).base64)
          }
          return ''
        })
        // Handle usage
        const usageData = response.usage
        const usageUsd = typeof usageData === 'number'
          ? usageData
          : (usageData && typeof usageData === 'object' && 'usd' in usageData)
            ? (usageData as { usd: number }).usd
            : 0
        result = {
          images,
          usage: usageUsd,
        }
        break
      }

      case 'balance': {
        const balanceResponse = await getBalance(PIXELLAB_API_KEY)
        // Balance could be {balance: N} or {balance: {usd: N}}
        const bal = balanceResponse.balance
        const balanceUsd = typeof bal === 'number'
          ? bal
          : (bal && typeof bal === 'object' && 'usd' in bal)
            ? (bal as { usd: number }).usd
            : 0
        result = { balance: balanceUsd }
        break
      }

      case 'estimate-skeleton': {
        const size = params.size as SkeletonSize
        const response = await estimateSkeleton(PIXELLAB_API_KEY, {
          size,
          image: params.image,
        })
        console.log('estimate-skeleton response:', JSON.stringify(response, null, 2))
        // Response could have skeleton or keypoints field
        const skeleton = response.skeleton || (response as unknown as { keypoints: unknown }).keypoints || []
        // Extract usage
        const usageData = response.usage
        const usageUsd = typeof usageData === 'number'
          ? usageData
          : (usageData && typeof usageData === 'object' && 'usd' in usageData)
            ? (usageData as { usd: number }).usd
            : 0
        result = {
          skeleton,
          usage: usageUsd,
        }
        break
      }

      case 'animate-skeleton': {
        const size = params.size as SkeletonSize
        const response = await animateWithSkeleton(PIXELLAB_API_KEY, {
          size,
          referenceImage: params.referenceImage,
          skeletonKeypoints: params.skeletonKeypoints as SkeletonKeypoint[][],
          noBackground: params.noBackground ?? true,
          seed: params.seed,
        })
        // Handle images array
        const images = (response.images || []).map((img: unknown) => {
          if (typeof img === 'string') return base64ToDataUrl(img)
          if (img && typeof img === 'object' && 'base64' in img) {
            return base64ToDataUrl((img as { base64: string }).base64)
          }
          return ''
        })
        // Handle usage
        const usageData = response.usage
        const usageUsd = typeof usageData === 'number'
          ? usageData
          : (usageData && typeof usageData === 'object' && 'usd' in usageData)
            ? (usageData as { usd: number }).usd
            : 0
        result = {
          images,
          usage: usageUsd,
        }
        break
      }

      case 'animate-v3-start': {
        // Start async animation job (v3 - supports larger sizes and more frames)
        const response = await animateWithTextV3Start(PIXELLAB_API_KEY, {
          firstFrame: params.firstFrame,
          action: params.animationAction,
          width: params.width || 128,
          height: params.height || 128,
          frameCount: params.frameCount || 8,
          noBackground: params.noBackground ?? true,
          seed: params.seed,
        })
        result = { jobId: response.backgroundJobId }
        break
      }

      case 'animate-v3-status': {
        // Check status of async animation job
        const status = await animateV3CheckStatus(PIXELLAB_API_KEY, params.jobId)
        console.log('v3 status response keys:', Object.keys(status))
        console.log('v3 status full:', JSON.stringify(status, null, 2).slice(0, 1000))

        // Try multiple possible response shapes
        const lastResp = status.last_response || (status as Record<string, unknown>).lastResponse || (status as Record<string, unknown>).result
        const images = lastResp?.images || (status as Record<string, unknown>).images

        if (status.status === 'completed' && images) {
          const processedImages = (images as unknown[]).map((img: unknown) => {
            if (typeof img === 'string') return base64ToDataUrl(img)
            if (img && typeof img === 'object' && 'base64' in img) {
              return base64ToDataUrl((img as { base64: string }).base64)
            }
            return ''
          })
          const usageData = status.usage
          const usageUsd = typeof usageData === 'number'
            ? usageData
            : (usageData && typeof usageData === 'object' && 'usd' in usageData)
              ? (usageData as { usd: number }).usd
              : 0
          result = { status: 'completed', images: processedImages, usage: usageUsd }
        } else if (status.status === 'failed') {
          result = { status: 'failed', error: status.error || 'Animation failed' }
        } else {
          // Return debug info when completed but no images found
          result = {
            status: status.status,
            debug: status.status === 'completed' ? { keys: Object.keys(status), hasLastResponse: !!status.last_response } : undefined
          }
        }
        break
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Pixellab API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
