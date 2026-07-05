# Firestore Security Specification

## Data Invariants
1. A task must belong to its owner or be part of a valid project.
2. Only authenticated users can create or modify documents.
3. System fields like `createdAt` and `ownerId` cannot be updated after creation.
4. Users cannot modify another user's PII or notifications.
5. Notes, Tasks, and Notifications are restricted to `ownerId` / `userId`.
6. Blog Articles and Posts can only be modified or deleted by their author.
7. Users can only read channels they are a member of.
8. Messages can only be created by members of the channel.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Creating a project without authentication.
2. **Identity Spoofing (Create)**: Creating a post with `authorId` set to a different user's UID.
3. **Identity Spoofing (Update)**: Updating another user's blog article.
4. **State Shortcutting**: Updating a kanban task status with arbitrary unapproved fields (Ghost Field).
5. **Resource Poisoning**: Using a document ID of 2000 characters to crash the database.
6. **Denial of Wallet**: Passing a string of 1MB for a blog post title.
7. **Role Escalation**: Updating a user document to set `role: 'superadmin'`.
8. **The PII Blanket**: Reading another user's private notification list.
9. **The Orphaned Record**: Creating a comment for a blog article that doesn't exist (if checked).
10. **Terminal State Break**: Attempting to change a project's fields without permissions.
11. **Type Poisoning**: Sending an object instead of a string for an event title.
12. **The "Immortal Field" Violation**: Trying to update `createdAt` or `ownerId` on an existing record.

## The Test Runner
Refer to `firestore.rules.test.ts` for the test implementation.
