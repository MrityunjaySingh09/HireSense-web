// import clientPromise from '@/lib/mongodb'
// import { ObjectId }  from 'mongodb'

// export async function GET() {
//   try {
//     const client = await clientPromise
//     const db     = client.db('armorclaw')

//     const data = await db
//       .collection('ledger')
//       .find({})
//       .sort({ createdAt: -1 })
//       .toArray()

//     // Serialize ObjectId → string so Response.json() doesn't crash
//     const serialized = data.map((doc) => ({
//       ...doc,
//       _id: doc._id.toString(),
//     }))

//     return Response.json(serialized)
//   } catch (err) {
//     console.error('[GET /api/ledger]', err)
//     return Response.json({ error: 'Failed to fetch ledger' }, { status: 500 })
//   }
// }