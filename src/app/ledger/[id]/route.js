import clientPromise from '@/lib/mongodb'
import { ObjectId }  from 'mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Validate that id is a well-formed ObjectId before hitting the DB
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const client = await clientPromise
    const db     = client.db('armorclaw')

    const doc = await db
      .collection('ledger')
      .findOne({ _id: new ObjectId(id) })

    if (!doc) {
      return Response.json({ error: 'Record not found' }, { status: 404 })
    }

    // Serialize ObjectId → string
    return Response.json({ ...doc, _id: doc._id.toString() })
  } catch (err) {
    console.error('[GET /api/ledger/[id]]', err)
    return Response.json({ error: 'Failed to fetch record' }, { status: 500 })
  }
}