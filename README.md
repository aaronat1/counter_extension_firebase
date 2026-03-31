# Firestore Collection Counter - Firebase Extension

> Maintains an accurate, real-time document count for your Firestore collections. Avoids expensive `countDocuments()` queries by keeping an atomic counter updated on every create and delete.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Firebase Extension](https://img.shields.io/badge/Firebase-Extension-FFCA28?logo=firebase)](https://firebase.google.com/products/extensions)

## Why Use This Extension?

Counting documents in Firestore is expensive. A `collection.count()` query reads every document in the collection, which costs one read per document. For a collection with 100,000 documents, that's 100,000 reads just to get a number. This extension keeps a counter that costs exactly **1 read** — always.

- **O(1) reads** — get the count with a single document read
- **Atomic updates** — uses Firestore transactions to prevent race conditions
- **Real-time accuracy** — counter updates on every create and delete
- **Safe floor** — counter never goes below zero
- **Configurable** — track all collections or only specific ones

## How It Works

```
1. Document created in "users"   -> _ext_counters/users.count = count + 1
2. Document deleted from "users" -> _ext_counters/users.count = count - 1
```

Counters are stored in `_ext_counters/{collectionName}` with a `count` field and `lastUpdated` timestamp.

## Installation

### Option 1: Firebase CLI

```
firebase ext:install aaronat1/firestore-collection-counter --project=YOUR_PROJECT_ID
```

### Option 2: From Source

```bash
git clone https://github.com/aaronat1/counter_extension_firebase.git
cd counter_extension_firebase
firebase ext:install . --project=YOUR_PROJECT_ID
```

## Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `LOCATION` | Cloud Functions deployment region | `us-central1` |
| `COUNTER_COLLECTION` | Collection where counters are stored | `_ext_counters` |
| `COUNTER_FIELD` | Field name for the count value | `count` |
| `TRACKED_COLLECTIONS` | Comma-separated collections to track (empty = all) | _(empty)_ |

## Reading a Counter

```javascript
// Get the user count - just 1 read!
const snap = await db.collection("_ext_counters").doc("users").get();
const userCount = snap.data()?.count; // e.g., 1523
```

## Counter Document Structure

```json
// _ext_counters/users
{
  "count": 1523,
  "lastUpdated": "2025-01-15T10:30:00.000Z"
}
```

## Seeding Existing Collections

If you install the extension on a database with existing documents, run this one-time script:

```javascript
const collections = ["users", "products", "orders"];
for (const col of collections) {
  const snap = await db.collection(col).count().get();
  await db.collection("_ext_counters").doc(col).set({
    count: snap.data().count,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
}
```

## Tech Stack

- **Runtime:** Node.js 20
- **Language:** TypeScript
- **Trigger:** Firestore `onCreate` + `onDelete` (depths 1-2)
- **Dependencies:** `firebase-admin`, `firebase-functions`

## Limitations

- Tracks top-level collections (L1) and one level of subcollections (L2).
- Under extreme write throughput (>1,000 writes/sec to a single collection), consider implementing [distributed counters](https://firebase.google.com/docs/firestore/solutions/counters).
- Pre-existing documents are not counted until you run the seeding script above.

## Billing

Blaze plan required. Each document creation or deletion triggers one function invocation and one transactional write. See [Firebase Pricing](https://firebase.google.com/pricing).

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.

## Author

**[@aaronat1](https://github.com/aaronat1)**
