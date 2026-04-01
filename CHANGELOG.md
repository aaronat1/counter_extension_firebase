## Version 0.1.1

- Fix: set Node.js engine to 18 for Cloud Build compatibility.
- Add package-lock.json for reproducible builds.

## Version 0.1.0

- Initial release.
- Tracks document counts for top-level collections (L1) and subcollections (L2).
- Atomic updates via Firestore transactions.
- Configurable counter collection and field names.
- Optional collection filter via TRACKED_COLLECTIONS parameter.
- Floor of 0: counter never goes negative.
