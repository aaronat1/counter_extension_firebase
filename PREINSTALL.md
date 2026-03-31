# Firestore Collection Counter

This extension keeps an up-to-date document count for your Firestore collections without requiring expensive `collectionGroup` queries or full reads.

## How It Works

- On every **document creation**, the counter for that collection is incremented by 1.
- On every **document deletion**, the counter is decremented by 1.
- Counters are stored in `{COUNTER_COLLECTION}/{collectionName}` with a `{COUNTER_FIELD}` field.
- Updates use Firestore transactions to guarantee consistency under concurrent writes.

## Prerequisites

- Firebase project with Firestore enabled.

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `LOCATION` | Cloud Functions region | `us-central1` |
| `COUNTER_COLLECTION` | Where counters are stored | `_ext_counters` |
| `COUNTER_FIELD` | Field name for the count | `count` |
| `TRACKED_COLLECTIONS` | Collections to track (empty = all) | _(empty)_ |

## Billing

This extension uses Cloud Functions for Firebase. See [Firebase Pricing](https://firebase.google.com/pricing) for details.

## Limitations

- Initial count for pre-existing documents is not automatically computed. Run a one-time migration script to seed the counters.
- Under extreme write throughput (>1 write/sec to one collection), consider sharded counters.
