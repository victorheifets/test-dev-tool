# Course Management API - Client Integration Guide

## Multi-Tenant API Integration

This document provides guidelines for client-side developers on how to properly integrate with our multi-tenant Course Management API. The API is designed with strict tenant isolation, ensuring that each client can only access data belonging to their specific tenant (provider).

## Authentication and Tenant Context

### Tenant Identification

Each request to the API must include tenant context information in the form of a provider ID. This is done via the `X-Provider-ID` HTTP header:

```
X-Provider-ID: 12345678-1234-5678-1234-567812345678
```

### Provider Initialization

Before making any other API calls, clients must first create a provider or select an existing provider. This provider ID will be used for all subsequent API calls.

#### Creating a New Provider

To create a new provider (special case that doesn't require tenant context):

```http
POST /api/providers/create
Content-Type: application/json

{
  "name": "Provider Name",
  "description": "Provider Description",
  "email": "contact@provider.com",
  "phone": "+1234567890",
  "website": "https://provider.com",
  "logo_url": "https://provider.com/logo.png"
}
```

Response will include the generated provider ID that should be stored and used for all subsequent requests.

#### Listing Available Providers

```http
GET /api/providers
```

## General Request Format

For all API requests after provider selection:

1. Include the `X-Provider-ID` header with every request
2. For POST/PUT requests, also include the same provider_id in the request body

Example:

```http
POST /api/activities
Content-Type: application/json
X-Provider-ID: 12345678-1234-5678-1234-567812345678

{
  "provider_id": "12345678-1234-5678-1234-567812345678",
  "name": "Activity Name",
  "description": "Activity Description",
  ...
}
```

## Activities API Example

### List Activities

```http
GET /api/activities
X-Provider-ID: 12345678-1234-5678-1234-567812345678
```

### Create Activity

```http
POST /api/activities
Content-Type: application/json
X-Provider-ID: 12345678-1234-5678-1234-567812345678

{
  "provider_id": "12345678-1234-5678-1234-567812345678",
  "name": "Workshop: Introduction to Programming",
  "description": "Learn the basics of programming",
  "start_date": "2025-07-15",
  "end_date": "2025-07-16",
  "capacity": 30,
  "location": "Online",
  "pricing": {
    "amount": 99.99,
    "currency": "USD"
  }
}
```

### Get Activity by ID

```http
GET /api/activities/{activity_id}
X-Provider-ID: 12345678-1234-5678-1234-567812345678
```

### Update Activity

```http
PUT /api/activities/{activity_id}
Content-Type: application/json
X-Provider-ID: 12345678-1234-5678-1234-567812345678

{
  "provider_id": "12345678-1234-5678-1234-567812345678",
  "name": "Updated Workshop Name",
  "description": "Updated description",
  ...
}
```

### Delete Activity

```http
DELETE /api/activities/{activity_id}
X-Provider-ID: 12345678-1234-5678-1234-567812345678
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid tenant context
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error

Validation errors will include details about the specific fields that failed validation:

```json
{
  "detail": [
    {
      "loc": ["body", "provider_id"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Client Implementation Best Practices

1. **Store Provider ID**: After creating or selecting a provider, store the provider ID securely in your client application (localStorage, secure cookie, etc.)

2. **Include Headers Consistently**: Set up your API client to automatically include the `X-Provider-ID` header with every request

3. **Include Provider ID in Request Bodies**: For POST and PUT requests, always include the provider_id in the request body

4. **Handle 401 Errors**: If you receive a 401 error with "Could not validate provider credentials", it likely means your tenant context is missing or invalid

5. **Connection Testing**: To test API connectivity, use the root endpoint:

   ```http
   GET /
   ```

   This will return API version and status information without requiring tenant context

## API Versioning

The current API version is included in all responses via the `X-API-Version` header. Clients should check this header to ensure compatibility.

## Rate Limiting

The API implements rate limiting per tenant. If you exceed the rate limit, you'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating when you can resume making requests.
