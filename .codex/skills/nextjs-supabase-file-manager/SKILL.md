---
name: nextjs-supabase-file-manager
description: Use when building full stack apps with Next.js and Supabase, especially authentication, storage, database operations, and Google-Drive style file manager systems.
---

# Next.js + Supabase + File Manager Skill

This skill helps implement scalable applications using:
- Next.js App Router
- Supabase Auth
- Supabase Database
- Supabase Storage
- TypeScript
- Vercel deployment

Use this skill when:
- Creating Next.js pages or API routes
- Implementing Supabase authentication
- Uploading or managing files
- Building folder/file systems
- Designing database schemas for storage systems

---

# Architecture Rules

Follow this architecture for projects:


/app
/components
/lib
/lib/supabase
/hooks
/services
/types
/utils


Guidelines:

- Keep Supabase client inside `/lib/supabase`
- All API/database logic inside `/services`
- UI components must remain presentational
- Avoid database calls directly inside UI components

---

# Supabase Client Setup

Always use a single shared client instance.

```ts
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

Server components should use the server client if available.

Authentication Rules

Use Supabase Auth.

Recommended flow:

User login via Supabase

Session stored in cookies

Validate session in middleware

Example:

middleware.ts

Check session before accessing protected routes.


File Manager System Design

Implement file management similar to cloud storage systems.

Core features:

Folder hierarchy

File upload

File metadata

Access permissions

Signed URLs


Database Schema
folders table
id (uuid)
name (text)
parent_id (uuid)
user_id (uuid)
created_at (timestamp)
files table
id (uuid)
name (text)
path (text)
size (number)
folder_id (uuid)
user_id (uuid)
created_at (timestamp)
File Upload Pattern

Files should be stored in Supabase Storage.

Storage path format:

files/{userId}/{folderId}/{filename}

Example upload:

await supabase.storage
  .from("files")
  .upload(`files/${userId}/${file.name}`, file)
File Access

Use signed URLs for secure access.

Example:

const { data } = await supabase.storage
  .from("files")
  .createSignedUrl(path, 60)
Security Rules

Always enforce:

Row Level Security (RLS)

user_id based access control

Signed storage URLs

Input validation

Example RLS rule:

user_id = auth.uid()
Performance Rules

Follow these practices:

Paginate large file lists

Use indexed columns

Cache signed URLs when possible

Avoid loading large directories in a single query

Error Handling

Always handle errors from Supabase:

if (error) {
  throw new Error(error.message)
}
AI Coding Guidelines

When generating code:

Prefer server components in Next.js

Keep business logic inside services

Avoid duplicating Supabase client instances

Ensure strict TypeScript typing

Follow modular architecture

Example Feature Requests This Skill Handles

"Create a file manager like Google Drive"

"Upload files to Supabase storage"

"Create nested folders"

"Build Supabase auth system"

"Generate Next.js API routes for file uploads"