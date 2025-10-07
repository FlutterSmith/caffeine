# Rate Limiting Implementation

This document describes the rate limiting configuration applied to all API routes to protect against abuse and DDoS attacks.

## Overview

Rate limiting has been implemented using the `express-rate-limit` package to protect all API endpoints. Different rate limits are applied based on the sensitivity and nature of each endpoint.

## Installation

```bash
npm install express-rate-limit
```

## Rate Limiters

### 1. General Rate Limiter (All Routes)

- **Applied to:** All `/api/*` routes by default
- **Limit:** 100 requests per 15 minutes per IP
- **Purpose:** Basic protection for all API endpoints

### 2. Authentication Rate Limiter (Strict)

- **Applied to:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- **Limit:** 5 requests per 15 minutes per IP
- **Purpose:** Prevent brute force attacks on authentication endpoints
- **Response:** HTTP 429 with custom error message

### 3. Payment Rate Limiter (Moderate)

- **Applied to:**
  - `POST /api/payment/create-intent`
  - `POST /api/payment/confirm`
  - `POST /api/payment/refund`
- **Limit:** 10 requests per 15 minutes per IP
- **Purpose:** Balance security with legitimate payment operations

### 4. Webhook Rate Limiter (Very Strict)

- **Applied to:**
  - `POST /api/payment/webhook`
- **Limit:** 10 requests per 1 minute per IP
- **Purpose:** Protect against malicious webhook calls

### 5. Order Rate Limiter

- **Applied to:**
  - `POST /api/orders`
  - `PATCH /api/orders/:id/status`
  - `DELETE /api/orders/:id`
- **Limit:** 20 requests per 15 minutes per IP
- **Purpose:** Prevent spam orders and excessive modifications

### 6. Read-Only Rate Limiter (Lenient)

- **Applied to:**
  - `GET /api/orders/:id`
  - `GET /api/orders`
- **Limit:** 200 requests per 15 minutes per IP
- **Purpose:** Allow more requests for read operations

## Rate Limit Response Format

When a rate limit is exceeded, the API returns:

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

HTTP Status Code: `429 Too Many Requests`

## Response Headers

All rate-limited responses include standard headers:

- `RateLimit-Limit`: Maximum number of requests allowed
- `RateLimit-Remaining`: Number of requests remaining
- `RateLimit-Reset`: Time when the rate limit will reset (Unix timestamp)

## Configuration Files

### Middleware Location

```
api/middleware/rateLimiter.js
```

### Usage in Routes

```javascript
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/login", authLimiter, async (req, res) => {
  // Route handler
});
```

## Customization

To modify rate limits, edit the `api/middleware/rateLimiter.js` file:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window
  max: 5, // Max requests per window
  message: {
    // Custom error message
    error: "Too many authentication attempts",
    retryAfter: "15 minutes",
  },
});
```

## Best Practices

1. **Monitor Rate Limits:** Track rate limit hits in production to adjust limits
2. **User Feedback:** Provide clear error messages when limits are exceeded
3. **Environment-Specific:** Consider more lenient limits in development
4. **IP-Based:** Current implementation uses IP addresses; consider user-based limits for authenticated routes
5. **Logging:** Log rate limit violations for security monitoring

## Testing

To test rate limiting:

1. Start the server: `npm run dev`
2. Make multiple requests to an endpoint
3. Observe the 429 response when limit is exceeded

## Production Considerations

1. **Redis Store:** Consider using Redis for distributed rate limiting across multiple servers:

```javascript
const RedisStore = require("rate-limit-redis");

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

2. **Proxy Setup:** If behind a proxy (like Nginx), configure trust proxy:

```javascript
app.set("trust proxy", 1);
```

3. **Custom Key Generator:** Use custom keys for more sophisticated tracking:

```javascript
const limiter = rateLimit({
  keyGenerator: (req) => {
    return req.user?.id || req.ip; // User ID for authenticated, IP for guests
  },
});
```

## Security Notes

- Rate limiting is defense-in-depth, not a complete security solution
- Always combine with input validation, authentication, and authorization
- Monitor for patterns that indicate attacks
- Consider implementing progressive delays for repeated violations
- Use HTTPS to prevent header manipulation

## Troubleshooting

**Issue:** Rate limit applied too aggressively

- **Solution:** Increase the `max` value or `windowMs` duration

**Issue:** Rate limit not working behind proxy

- **Solution:** Set `trust proxy` in Express: `app.set('trust proxy', 1)`

**Issue:** Need different limits for different user types

- **Solution:** Implement custom middleware to check user role and apply different limiters

## Support

For issues or questions about rate limiting:

1. Check the `express-rate-limit` documentation: https://github.com/express-rate-limit/express-rate-limit
2. Review server logs for rate limit violations
3. Test with different IP addresses or clear your rate limit state
