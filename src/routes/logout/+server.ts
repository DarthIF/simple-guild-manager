import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
    return new Response(ReasonPhrases.CONFLICT);
};