# Cremunaflix API v1

Base URL: `/api/v1`

## Conventions
- All timestamps are ISO-8601 strings.
- All lists return `items`, `page`, `pageSize`, `total`.
- Errors return `ApiError`.

### ApiError
```json
{
  "code": "NOT_FOUND",
  "message": "Film not found",
  "details": "film-999"
}
```

## GET /api/v1/home
Aggregated payload for the Home screen.

Response:
```json
{
  "hero": {
    "title": "Proxima sessao",
    "items": [
      {
        "id": "session-001",
        "filmId": "film-003",
        "startsAt": "2024-09-05T20:00:00-03:00",
        "status": "UPCOMING",
        "host": "Equipe Cremuna",
        "room": "Discord - Sala Aurora",
        "notes": "Sessao comentada com trilha extra."
      }
    ]
  },
  "lastExhibited": [
    {
      "id": "film-001",
      "title": "Neon Drift",
      "year": 2023,
      "durationMinutes": 118,
      "genres": ["Sci-Fi", "Thriller"],
      "synopsis": "Uma piloto de testes descobre uma cidade espelhada escondida sob a metropole e precisa escolher qual realidade salvar.",
      "rating": 8.1,
      "status": "SCREENED",
      "accentColor": "#ff6b4a",
      "backdrop": "linear-gradient(130deg, #1a0f1f 0%, #4b1b4b 50%, #ff6b4a 100%)"
    }
  ],
  "mostRequested": [
    {
      "id": "film-002",
      "title": "Mare de Marte",
      "year": 2024,
      "durationMinutes": 129,
      "genres": ["Adventure", "Sci-Fi"],
      "synopsis": "Uma equipe de pesquisadores enfrenta tempestades eletromagneticas enquanto tenta restaurar um farol marciano.",
      "rating": 8.4,
      "status": "SCHEDULED",
      "accentColor": "#ff9f4a",
      "backdrop": "linear-gradient(120deg, #2a1008 0%, #7a2b10 55%, #ff9f4a 100%)"
    }
  ]
}
```

Notes:
- `hero` can be `null` or omitted.
- `lastExhibited` and `mostRequested` are `MovieSummaryDTO` (subset of `MovieDTO`).

## GET /api/v1/catalog
List films with optional filters.

Query params:
- `query` (string) search by title
- `genre` (string)
- `year` (number)
- `status` (SCREENED | SCHEDULED)
- `page` (number, default 1)
- `pageSize` (number, default 20)

Response:
```json
{
  "items": [
    {
      "id": "film-001",
      "title": "Neon Drift",
      "year": 2023,
      "durationMinutes": 118,
      "genres": ["Sci-Fi", "Thriller"],
      "synopsis": "Uma piloto de testes descobre uma cidade espelhada escondida sob a metropole e precisa escolher qual realidade salvar.",
      "rating": 8.1,
      "status": "SCREENED",
      "accentColor": "#ff6b4a",
      "backdrop": "linear-gradient(130deg, #1a0f1f 0%, #4b1b4b 50%, #ff6b4a 100%)"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 20
}
```

Errors:
- `400` invalid query

## GET /api/v1/films/:id
Get film details.

Response:
```json
{
  "id": "film-003",
  "title": "Mare de Marte",
  "year": 2024,
  "durationMinutes": 129,
  "genres": ["Adventure", "Sci-Fi"],
  "synopsis": "Uma equipe de pesquisadores enfrenta tempestades eletromagneticas enquanto tenta restaurar um farol marciano.",
  "rating": 8.4,
  "status": "SCHEDULED",
  "accentColor": "#ff9f4a",
  "backdrop": "linear-gradient(120deg, #2a1008 0%, #7a2b10 55%, #ff9f4a 100%)"
}
```

Errors:
- `404` film not found

## GET /api/v1/sessions/upcoming
List upcoming sessions.

Response:
```json
[
  {
    "id": "session-001",
    "filmId": "film-003",
    "startsAt": "2024-09-05T20:00:00-03:00",
    "status": "UPCOMING",
    "host": "Equipe Cremuna",
    "room": "Discord - Sala Aurora",
    "notes": "Sessao comentada com trilha extra."
  }
]
```

## GET /api/v1/sessions/past
List past sessions.

Query params:
- `from` (ISO string)
- `to` (ISO string)

Response:
```json
[
  {
    "id": "session-005",
    "filmId": "film-006",
    "startsAt": "2024-07-19T20:00:00-03:00",
    "status": "PAST",
    "host": "Equipe Cremuna",
    "room": "Discord - Sala Oceano"
  }
]
```

## GET /api/v1/requests
List film requests.

Query params:
- `sort` (newest | oldest)
- `page` (number, default 1)
- `pageSize` (number, default 10)

Response:
```json
{
  "items": [
    {
      "id": "req-002",
      "title": "A Chegada",
      "link": "https://www.imdb.com/title/tt2543164/",
      "reason": "Narrativa sobre comunicacao e linguagem.",
      "status": "OPEN",
      "createdAt": "2024-07-05T14:12:00-03:00"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 10
}
```

## POST /api/v1/requests
Create a new request.

Request body:
```json
{
  "title": "Blade Runner 2049",
  "link": "https://www.imdb.com/title/tt1856101/",
  "reason": "Visual cinematografico e trilha impecavel para sessao comentada."
}
```

Response:
```json
{
  "id": "req-011",
  "title": "Blade Runner 2049",
  "link": "https://www.imdb.com/title/tt1856101/",
  "reason": "Visual cinematografico e trilha impecavel para sessao comentada.",
  "status": "OPEN",
  "createdAt": "2024-08-01T10:30:00-03:00"
}
```

Errors:
- `400` validation error

## GET /api/v1/me
Future endpoint for authenticated user profile.

Response:
```json
{
  "id": "user-001",
  "displayName": "Cremuna",
  "role": "ADMIN"
}
```

Errors:
- `401` unauthorized
