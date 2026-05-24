import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res)
      case 'POST':
        return handlePost(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/templates - List all templates
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { category, limit = '50', offset = '0' } = req.query

  const where = category ? { category: String(category) } : {}

  const templates = await prisma.template.findMany({
    where,
    take: parseInt(String(limit)),
    skip: parseInt(String(offset)),
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      cols: true,
      rows: true,
      thumbnail: true,
      isPublic: true,
      tags: true,
      connectors: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const total = await prisma.template.count({ where })

  return res.status(200).json({
    templates,
    total,
    limit: parseInt(String(limit)),
    offset: parseInt(String(offset)),
  })
}

// POST /api/templates - Create a new template
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    description,
    category = 'custom',
    cols = 50,
    rows = 50,
    cellSize = 16,
    isoScale = 2.5,
    spawnCol = 25,
    spawnRow = 25,
    groundData,
    heightData,
    assetsData,
    connectors = [],
    thumbnail,
    isPublic = false,
    tags = [],
  } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  if (!groundData || !heightData || !assetsData) {
    return res.status(400).json({ error: 'Grid data (groundData, heightData, assetsData) is required' })
  }

  const template = await prisma.template.create({
    data: {
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
    },
  })

  return res.status(201).json(template)
}
