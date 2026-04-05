import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 })
  }

  // Validate MongoDB ObjectId format before querying
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: `"${id}" is not a valid record ID.` }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db('armorclaw')

    const doc = await db
      .collection('ledger')
      .findOne({ _id: new ObjectId(id) })

    if (!doc) {
      return NextResponse.json({ error: 'Record not found.' }, { status: 404 })
    }

    return NextResponse.json({
      ...doc,
      _id: doc._id.toString(),
    })
  } catch (err) {
    console.error(`[GET /api/ledger/${id}]`, err)
    return NextResponse.json(
      { error: 'Failed to fetch record.' },
      { status: 500 }
    )
  }
}