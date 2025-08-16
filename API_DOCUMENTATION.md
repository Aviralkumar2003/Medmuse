# MedMuse Backend API Documentation

Base URL: `/api`

---

## Authentication
- **OAuth2 (Google) session-based**
- Use `/auth/login` to get the login URL
- After login, session cookie is used for authentication
- Most endpoints require authentication (except `/auth/status`, `/auth/login`, `/symptoms/**`)

---

## Endpoints

### Auth
- `GET /auth/status` — Check authentication status
  - **Response:** `{ authenticated: boolean, user?: UserDto }`
- `GET /auth/user` — Get current user info
  - **Response:** `UserDto`
- `GET /auth/login` — Get Google login URL
  - **Response:** `{ loginUrl: string }`
- `POST /auth/logout` — Logout
  - **Response:** `{ message: string, logoutUrl: string }`

### Users
- `GET /users/me` — Get current user profile
  - **Response:** `UserDto`
- `PUT /users/me` — Update user profile (name)
  - **Body:** `{ name: string }`
  - **Response:** `UserDto`

### Symptoms
- `GET /symptoms/getAllSymptoms` — List all active symptoms
  - **Response:** `Symptom[]`
- `GET /symptoms/category/{category}` — List symptoms by category
  - **Response:** `Symptom[]`
- `GET /symptoms/search?q=term` — Search symptoms
  - **Response:** `Symptom[]`

### Symptom Entries
- `POST /symptom-entries` — Create multiple symptom entries
  - **Body:** `{ entries: SymptomEntryDto[] }`
  - **Response:** `SymptomEntryDto[]`
- `GET /symptom-entries/my` — Get paginated symptom entries for current user
  - **Query:** `page`, `size`, etc.
  - **Response:** `Page<SymptomEntryDto>`
- `PUT /symptom-entries/{entryId}` — Update a symptom entry
  - **Body:** `SymptomEntryDto`
  - **Response:** `SymptomEntryDto`
- `DELETE /symptom-entries/{entryId}` — Delete a symptom entry
  - **Response:** `204 No Content`

### Reports
- `POST /reports/generate` — Generate weekly report (AI)
  - **Response:** `ReportDto`
- `POST /reports/generate/custom?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` — Generate custom report
  - **Response:** `ReportDto`
- `GET /reports/my` — List all reports for current user
  - **Response:** `ReportDto[]`
- `GET /reports/my/paginated` — Paginated reports
  - **Query:** `page`, `size`, etc.
  - **Response:** `Page<ReportDto>`
- `GET /reports/{reportId}` — Get report by ID
  - **Response:** `ReportDto`
- `GET /reports/{reportId}/pdf` — Download report as PDF
  - **Response:** `application/pdf`
- `DELETE /reports/{reportId}` — Delete a report
  - **Response:** `204 No Content`

---

## Data Transfer Objects (DTOs)

### UserDto
```
{
  id: number,
  googleId: string,
  email: string,
  name: string,
  profilePicture: string,
  createdAt: string (ISO8601)
}
```

### SymptomEntryDto
```
{
  id: number,
  symptomId: number,
  severity: number (1-10),
  notes: string,
  entryDate: string (YYYY-MM-DD),
  symptomName: string,
  symptomCategory: string,
  createdAt: string (ISO8601)
}
```

### ReportDto
```
{
  id: number,
  weekStartDate: string (YYYY-MM-DD),
  weekEndDate: string (YYYY-MM-DD),
  generatedAt: string (ISO8601),
  healthSummary: string,
  riskAreas: string,
  recommendations: string,
  hasPdf: boolean
}
```

### HealthAnalysisRequest
```
{
  userId: number,
  startDate: string (YYYY-MM-DD),
  endDate: string (YYYY-MM-DD),
  symptomEntries: SymptomEntryDto[]
}
```

### HealthAnalysisResponse
```
{
  healthSummary: string,
  riskAreas: string,
  recommendations: string,
  aiProvider: string
}
```

---

## Error Handling
- Standard HTTP status codes are used (400, 401, 403, 404, 500, etc.)
- Error responses are typically:
```
{
  "error": "Error message"
}
```

---

## Notes
- All endpoints (except public ones) require a valid session cookie (set by OAuth2 login).
- For paginated endpoints, use `page`, `size`, and sorting query params as per Spring Data conventions.
- For more details, see the backend source code or contact the maintainers.
