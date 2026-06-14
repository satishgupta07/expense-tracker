/**
 * Auth.js v5 catch-all Route Handler.
 *
 * Auth.js exports a `handlers` object containing GET and POST functions.
 * Re-exporting them as named exports here wires up every Auth.js endpoint
 * (sign-in, sign-out, session, callback URLs, etc.) under `/api/auth/*`.
 */

import { handlers } from '@/auth'

export const { GET, POST } = handlers
