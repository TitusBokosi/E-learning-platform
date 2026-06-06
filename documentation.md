# E-Learning Platform API Documentation

Backend REST API for an e-learning platform. All protected routes require a valid **JWT access token** sent as a `Bearer` token in the `Authorization` header. Refresh tokens are stored in an HTTP-only cookie named `refreshToken`.

---

## Auth Legend

| Symbol | Meaning |
|--------|---------|
| 🔓 | Public — no authentication required |
| 🔐 | Authenticated — valid access token required |
| 🛡️ | Admin/Super-Creator — access token + specific role required |

---

## 1. Auth Routes — `/auth`

### `POST /auth/signup` 🔓
Register a new user account.

**Body:**
```json
{ "firstname": "John", "lastname": "Doe", "email": "john@example.com", "password": "secret123" }
```
**Returns `201`:**
```json
{ "status": "success", "data": { "id": "uuid", "firstname": "John", "lastname": "Doe", "email": "john@example.com", "role": "STUDENT" } }
```
**Returns `400`:** User already exists.

---

### `POST /auth/login` 🔓
Login with email and password. Sets `refreshToken` in an HTTP-only cookie.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Returns `200`:**
```json
{ "status": "success", "data": { "accessToken": "eyJ...", "user": { "id": "uuid", "email": "...", "role": "STUDENT", "firstname": "John", "lastname": "Doe" } } }
```
**Returns `401`:** Incorrect credentials.

---

### `POST /auth/refresh` 🔓 *(requires valid `refreshToken` cookie)*
Issues a new access token using the refresh token stored in the cookie.

**Returns `200`:**
```json
{ "status": "Success", "data": { "accessToken": "eyJ..." } }
```
**Returns `401`:** Refresh token expired or invalid.

---

### `POST /auth/logout` 🔐
Clears the `refreshToken` cookie and logs the user out.

**Returns `200`:**
```json
{ "status": "Success", "message": "Logout successful" }
```

---

### `PATCH /auth/password` 🔐
Change the currently authenticated user's password.

**Body:**
```json
{ "currentPassword": "old123", "newPassword": "new456", "verifiedPassword": "new456" }
```
**Returns `200`:**
```json
{ "status": "Success", "message": "Password updated successfully" }
```
**Returns `400`:** Wrong current password, or new passwords don't match.

---

## 2. User Routes — `/users`

### `GET /users` 🛡️
Get a list of all users (admin only).

**Returns `200`:**
```json
{ "status": "success", "data": [ { "id": "uuid", "firstname": "...", "lastname": "...", "email": "...", "role": "STUDENT" } ] }
```

---

### `GET /users/me` 🔐
Get the currently authenticated user's profile.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "firstname": "John", "lastname": "Doe", "email": "...", "role": "STUDENT" } }
```
**Returns `404`:** User not found.

---

### `PATCH /users/me` 🔐
Update the currently authenticated user's profile.

**Body (at least one field required):**
```json
{ "firstname": "Jane", "lastname": "Smith", "email": "jane@example.com" }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated user object */ } }
```

---

### `DELETE /users/me` 🔐
Delete the currently authenticated user's own account.

**Returns `204`:** No content.

---

### `GET /users/:userId` 🔐
Get a profile by ID. Users can access their own profile; `ADMIN` can access any profile.

**Params:** `userId` — UUID of the target user.

**Returns `200`:** User object.

---

### `PATCH /users/:userId/role` 🛡️
Change a user's role (admin only).

**Params:** `userId` — UUID of the target user.

**Body:**
```json
{ "role": "ADMIN" }
```
**Returns `200`:**
```json
{ "message": "User role updated successfully", "data": { /* updated user object */ } }
```

---

### `DELETE /users/:userId` 🛡️
Delete any user account by ID (admin only).

**Params:** `userId` — UUID of the target user.

**Returns `204`:** No content.

---

## 3. Course Routes — `/courses`

### `GET /courses` 🔓
Get all courses. Accepts optional `?limit=N` query param.

**Returns `200`:**
```json
{ "status": "success", "results": 10, "data": [ { "id": "uuid", "courseName": "...", "description": "...", "imageUrl": "...", "category": { "categoryid": "uuid", "categoryName": "..." } } ] }
```

---

### `GET /courses/:courseId` 🔓
Get a single course with its full topic and lesson tree.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "courseName": "...", "topics": [ { "id": "uuid", "topicName": "...", "position": 1, "lessons": [ { "id": "uuid", "lessonName": "...", "lessonType": "VIDEO", "position": 1 } ] } ], "project": { "id": "uuid", "title": "..." } } }
```
**Returns `404`:** Course not found.

---

### `POST /courses` 🛡️
Create a new course.

**Body:**
```json
{ "courseName": "Intro to Node.js", "description": "Learn the basics...", "imageUrl": "https://...", "categoryId": "uuid (optional)" }
```
**Returns `201`:**
```json
{ "status": "success", "data": { /* new course object */ } }
```

---

### `PATCH /courses/:courseId` 🛡️
Update a course.

**Body (any field optional):**
```json
{ "courseName": "Updated Name", "description": "Updated desc", "categoryId": "uuid or null" }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated course object */ } }
```

---

### `DELETE /courses/:courseId` 🛡️
Delete a course (cascades to topics, lessons, and project).

---

### `POST /courses/:courseId/approve` 🛡️
Approve a pending course (Admin/Super-Creator only).

**Returns `200`:** Success status and updated course.

---

### `POST /courses/:courseId/reject` 🛡️
Reject a pending course (Admin/Super-Creator only).

**Returns `200`:** Success status and updated course.

---

## 4. Topic Routes — `/courses/:courseId/topics`

Topics are always accessed in the context of their parent course.

### `GET /courses/:courseId/topics` 🔓
Get all topics for a course, ordered by position.

**Returns `200`:**
```json
{ "status": "success", "results": 3, "data": [ { "id": "uuid", "topicName": "...", "position": 1, "lessons": [ /* ... */ ] } ] }
```

---

### `GET /courses/:courseId/topics/:topicId` 🔓
Get a single topic with its lessons.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "topicName": "...", "lessons": [ /* ordered by position */ ] } }
```
**Returns `404`:** Topic not found.

---

### `POST /courses/:courseId/topics` 🛡️
Create a new topic under a course.

**Body:**
```json
{ "topicName": "Variables and Types", "courseId": "uuid", "position": 1 }
```
**Returns `201`:**
```json
{ "status": "success", "data": { /* new topic object */ } }
```

---

### `PATCH /courses/:courseId/topics/:topicId` 🛡️
Update a topic.

**Body (any field optional):**
```json
{ "topicName": "Updated Topic", "position": 2 }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated topic object */ } }
```

---

### `DELETE /courses/:courseId/topics/:topicId` 🛡️
Delete a topic (cascades to its lessons).

---

### `POST /courses/:courseId/topics/:topicId/approve` 🛡️
Approve a pending topic.

---

### `POST /courses/:courseId/topics/:topicId/reject` 🛡️
Reject a pending topic.

---

## 5. Lesson Routes — `/courses/:courseId/topics/:topicId/lessons`

Lessons are accessed in the context of their parent topic and course.

### `GET /courses/:courseId/topics/:topicId/lessons` 🔓
Get all lessons for a topic, ordered by position.

**Returns `200`:**
```json
{ "status": "success", "data": [ { "id": "uuid", "lessonName": "...", "lessonType": "TEXT", "position": 1 } ] }
```

---

### `GET /courses/:courseId/topics/:topicId/lessons/:lessonId` 🔓
Get a single lesson with prev/next navigation IDs.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "lessonName": "...", "lessonType": "VIDEO", "videoUrl": "...", "content": null, "prevLessonId": "uuid or null", "nextLessonId": "uuid or null" } }
```
**Returns `404`:** Lesson not found.

---

### `POST /courses/:courseId/topics/:topicId/lessons` 🛡️
Create a new lesson.

**Body:**
```json
{ "lessonName": "Introduction", "lessonType": "VIDEO", "videoUrl": "https://...", "topicId": "uuid", "position": 1 }
```
`lessonType` must be one of: `VIDEO`, `TEXT`, `MINI_PROJECT`.

**Returns `201`:**
```json
{ "status": "success", "data": { /* new lesson object */ } }
```

---

### `PATCH /courses/:courseId/topics/:topicId/lessons/:lessonId` 🛡️
Update a lesson.

**Body (any field optional):**
```json
{ "lessonName": "Intro (updated)", "position": 2, "lessonType": "TEXT", "content": "Text content here..." }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated lesson object */ } }
```

---

### `DELETE /courses/:courseId/topics/:topicId/lessons/:lessonId` 🛡️
Delete a lesson.

---

### `POST /courses/:courseId/topics/:topicId/lessons/:lessonId/approve` 🛡️
Approve a pending lesson.

---

### `POST /courses/:courseId/topics/:topicId/lessons/:lessonId/reject` 🛡️
Reject a pending lesson.

**Body:**
```json
{ "feedback": "string" }
```

---

## 6. Category Routes — `/categories`

### `GET /categories` 🔓
Get all categories with their associated courses.

**Returns `200`:**
```json
{ "status": "success", "results": 5, "data": [ { "categoryid": "uuid", "categoryName": "Web Development", "courses": [ /* ... */ ] } ] }
```

---

### `GET /categories/:categoryId` 🔓
Get a single category.

**Returns `200`:**
```json
{ "status": "success", "data": { "categoryid": "uuid", "categoryName": "...", "courses": [ /* ... */ ] } }
```
**Returns `404`:** Category not found.

---

### `POST /categories` 🛡️
Create a new category.

**Body:**
```json
{ "categoryName": "Data Science" }
```
**Returns `201`:**
```json
{ "status": "success", "data": { /* new category object */ } }
```

---

### `PATCH /categories/:categoryId` 🛡️
Update a category.

**Body:**
```json
{ "categoryName": "Updated Name" }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated category object */ } }
```

---

### `DELETE /categories/:categoryId` 🛡️
Delete a category (**Permanently deletes all associated courses**).

**Returns `204`:** No content.

---

## 7. Project Routes — `/projects`

Each course has at most one capstone project.

### `GET /projects/course/:courseId` 🔓
Get the project associated with a specific course.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "title": "Build a REST API", "description": "...", "rubric": "..." } }
```
**Returns `404`:** No project found for this course.

---

### `GET /projects/:projectId` 🔓
Get a project by its own ID.

**Returns `200`:**
```json
{ "status": "success", "data": { /* project object */ } }
```
**Returns `404`:** Project not found.

---

### `POST /projects` 🛡️
Create a project and assign it to a course.

**Body:**
```json
{ "title": "Final Project", "description": "Build a full-stack app.", "rubric": "Optional grading rubric", "courseId": "uuid" }
```
**Returns `201`:**
```json
{ "status": "success", "data": { /* new project object */ } }
```

---

### `PATCH /projects/:projectId` 🛡️
Update a project.

**Body (any field optional):**
```json
{ "title": "Updated Title", "description": "Updated desc" }
```
**Returns `200`:**
```json
{ "status": "success", "data": { /* updated project object */ } }
```

---

### `DELETE /projects/:projectId` 🛡️
Delete a project.

**Returns `204`:** No content.

---

## 8. Enrollment Routes — `/enrollments`

### `POST /enrollments` 🔐
Enroll the current user in a course. Admin can also enroll another user by supplying `userId`.

**Body:**
```json
{ "courseId": "uuid", "userId": "uuid (admin only, optional)", "status": "ACTIVE (optional)" }
```
**Returns `201`:**
```json
{ "status": "success", "data": { "id": "uuid", "userid": "...", "courseid": "...", "status": "ACTIVE" } }
```

---

### `GET /enrollments/user` 🔐
Get enrollments for the currently authenticated user.

**Returns `200`:**
```json
{ "status": "success", "results": 3, "data": [ { "id": "uuid", "course": { /* course object */ }, "status": "ACTIVE" } ] }
```

---

### `GET /enrollments/user/:userId` 🔐
Get all enrollments for a specific user (admin can query any user; regular users should match their own ID).

**Returns `200`:**
```json
{ "status": "success", "results": 3, "data": [ { "id": "uuid", "course": { /* course object */ }, "status": "ACTIVE" } ] }
```

---

### `GET /enrollments/course/:courseId` 🛡️
Get all enrollments for a specific course (admin only).

**Returns `200`:**
```json
{ "status": "success", "results": 30, "data": [ { "id": "uuid", "user": { "id": "uuid", "firstname": "...", "email": "..." } } ] }
```

---

### `GET /enrollments/:enrollmentId` 🔐
Get a specific enrollment by ID.

**Returns `200`:**
```json
{ "status": "success", "data": { "id": "uuid", "user": { "firstname": "...", "email": "..." }, "course": { "courseName": "..." }, "status": "ACTIVE" } }
```
**Returns `404`:** Enrollment not found.

---

### `PATCH /enrollments/:enrollmentId` 🛡️
Update an enrollment's status (admin only).

**Body:**
```json
{ "status": "COMPLETED" }
```
`status` must be one of: `ACTIVE`, `COMPLETED`, `DROPPED`.

**Returns `200`:**
```json
{ "status": "success", "data": { /* updated enrollment object */ } }
```

---

### `DELETE /enrollments/:enrollmentId` 🛡️
Remove an enrollment (admin only).

**Returns `204`:** No content.

---

## 9. Lesson Progress Routes — `/progress`

Tracks which lessons a user has completed.

### `POST /progress` 🔐
Mark a lesson as complete. Idempotent — returns existing record if already marked complete.

**Body:**
```json
{ "lessonId": "uuid", "userId": "uuid (optional, defaults to self)" }
```
**Returns `201`:** New progress record created.
```json
{ "status": "success", "data": { "id": "uuid", "userid": "...", "lessonid": "...", "completedAt": "2026-..." } }
```
**Returns `200`:** Already completed (idempotent, no duplicate created).

---

### `GET /progress/user` 🔐
Get all lesson progress for the currently authenticated user.

**Returns `200`:**
```json
{ "status": "success", "results": 12, "data": [ { "id": "uuid", "lesson": { "lessonName": "...", "lessonType": "VIDEO" }, "completedAt": "..." } ] }
```

---

### `GET /progress/user/:userId` 🔐
Get all lesson progress for a specific user (admin can query any user).

**Returns `200`:**
```json
{ "status": "success", "results": 12, "data": [ { "id": "uuid", "lesson": { "lessonName": "...", "lessonType": "VIDEO" }, "completedAt": "..." } ] }
```

---

### `GET /progress/:progressId` 🔐
Get a single progress record by ID.

**Returns `200`:**
```json
{ "status": "success", "data": { /* progress object */ } }
```
**Returns `404`:** Progress record not found.

---

### `DELETE /progress/:progressId` 🔐
Remove a progress record (un-mark a lesson as complete).

**Returns `204`:** No content.

---

## 10. Administrative & Global Routes — `/admin`

These routes handle platform-wide management, statistics, and announcements.

### `GET /admin/stats` 🛡️
Get high-level platform statistics (User counts, Course counts, Category counts).

---

### `GET /admin/activity` 🛡️
Get a list of recent administrative activity and platform events.

---

### `GET /admin/announcements/public` 🔓
Get all active platform announcements for display on the landing page or dashboard.

---

### `GET /admin/announcements` 🛡️
Get all announcements (includes inactive/archived).

---

### `POST /admin/announcements` 🛡️
Create a new platform announcement.

---

### `PATCH /admin/announcements/:id/toggle` 🛡️
Enable or disable an announcement.

---

### `GET /admin/featured-courses` 🔓
Get a list of courses marked as `isFeatured`.

---

### `PATCH /admin/courses/:courseId/toggle-featured` 🛡️
Toggle the `isFeatured` status of a specific course.

---

## Common Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Bad request — validation failed or missing fields |
| `401` | Unauthorized — missing or invalid access token |
| `403` | Forbidden — authenticated but insufficient role |
| `404` | Not found — resource doesn't exist |
| `500` | Server error — unhandled exception |

All errors follow this shape:
```json
{ "status": "fail" | "error", "message": "Human-readable reason" }
```

Validation errors additionally include a detailed `errors` array:
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```