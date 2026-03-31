# Firestore Collection Counter — Setup Complete

Counters are now being maintained in:

```
${param:COUNTER_COLLECTION}/{collectionName}.${param:COUNTER_FIELD}
```

## Read a Counter

```js
const snap = await db.collection("${param:COUNTER_COLLECTION}").doc("users").get();
console.log("User count:", snap.data()?.${param:COUNTER_FIELD});
```

## Tracked Collections

`${param:TRACKED_COLLECTIONS}` _(empty = all collections)_

## Seed Existing Collections

If you have pre-existing documents, run this one-time script:

```js
const col = await db.collection("users").get();
await db.collection("${param:COUNTER_COLLECTION}").doc("users").set({
  "${param:COUNTER_FIELD}": col.size,
  lastUpdated: admin.firestore.FieldValue.serverTimestamp()
});
```

## Support

[GitHub repository](https://github.com/aaronat1/firestore-collection-counter)
