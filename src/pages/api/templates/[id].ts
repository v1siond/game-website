import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Template ID is required' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(id, res)
      case 'PUT':
        return handlePut(id, req, res)
      case 'DELETE':
        return handleDelete(id, res)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/templates/[id] - Get a single template with full data
async function handleGet(id: string, res: NextApiResponse) {
  const template = await prisma.template.findUnique({
    where: { id },
  })

  if (!template) {
    return res.status(404).json({ error: 'Template not found' })
  }

  return res.status(200).json(template)
}

// PUT /api/templates/[id] - Update a template
async function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
  const existing = await prisma.template.findUnique({ where: { id } })

  if (!existing) {
    return res.status(404).json({ error: 'Template not found' })
  }

  const {
    name,
    description,
    category,
    cols,
    rows,
    cellSize,
    isoScale,
    spawnCol,
    spawnRow,
    groundData,
    heightData,
    assetsData,
    connectors,
    thumbnail,
    isPublic,
    tags,
  } = req.body

  const template = await prisma.template.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(cols !== undefined && { cols }),
      ...(rows !== undefined && { rows }),
      ...(cellSize !== undefined && { cellSize }),
      ...(isoScale !== undefined && { isoScale }),
      ...(spawnCol !== undefined && { spawnCol }),
      ...(spawnRow !== undefined && { spawnRow }),
      ...(groundData !== undefined && { groundData }),
      ...(heightData !== undefined && { heightData }),
      ...(assetsData !== undefined && { assetsData }),
      ...(connectors !== undefined && { connectors }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(isPublic !== undefined && { isPublic }),
      ...(tags !== undefined && { tags }),
    },
  })

  return res.status(200).json(template)
}

// DELETE /api/templates/[id] - Delete a template
async function handleDelete(id: string, res: NextApiResponse) {
  const existing = await prisma.template.findUnique({ where: { id } })

  if (!existing) {
    return res.status(404).json({ error: 'Template not found' })
  }

  await prisma.template.delete({ where: { id } })

  return res.status(200).json({ success: true, id })
}
