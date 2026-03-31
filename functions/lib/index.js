"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrementCounterL2 = exports.incrementCounterL2 = exports.decrementCounterL1 = exports.incrementCounterL1 = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
const COUNTER_COLLECTION = process.env.COUNTER_COLLECTION ?? "_ext_counters";
const COUNTER_FIELD = process.env.COUNTER_FIELD ?? "count";
const TRACKED_COLLECTIONS = (process.env.TRACKED_COLLECTIONS ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
function shouldTrack(collection) {
    if (collection.startsWith("_ext_")) return false;
    if (collection === COUNTER_COLLECTION) return false;
    if (TRACKED_COLLECTIONS.length > 0 && !TRACKED_COLLECTIONS.includes(collection)) return false;
    return true;
}
async function updateCounter(collection, delta) {
    if (!shouldTrack(collection)) return null;
    const counterRef = admin.firestore().collection(COUNTER_COLLECTION).doc(collection);
    functions.logger.info(`Updating counter for "${collection}" by ${delta > 0 ? "+" : ""}${delta}`);
    try {
        await admin.firestore().runTransaction(async (tx) => {
            const snap = await tx.get(counterRef);
            const current = snap.exists ? ((snap.data()?.[COUNTER_FIELD]) ?? 0) : 0;
            const next = Math.max(0, current + delta);
            tx.set(counterRef, { [COUNTER_FIELD]: next, lastUpdated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
    }
    catch (err) {
        functions.logger.error("Failed to update counter", { err, collection, delta });
    }
    return null;
}
exports.incrementCounterL1 = functions.firestore
    .document("{c1}/{d1}")
    .onCreate((_snap, ctx) => updateCounter(ctx.params.c1, +1));
exports.decrementCounterL1 = functions.firestore
    .document("{c1}/{d1}")
    .onDelete((_snap, ctx) => updateCounter(ctx.params.c1, -1));
exports.incrementCounterL2 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}")
    .onCreate((_snap, ctx) => updateCounter(`${ctx.params.c1}/${ctx.params.d1}/${ctx.params.c2}`, +1));
exports.decrementCounterL2 = functions.firestore
    .document("{c1}/{d1}/{c2}/{d2}")
    .onDelete((_snap, ctx) => updateCounter(`${ctx.params.c1}/${ctx.params.d1}/${ctx.params.c2}`, -1));
