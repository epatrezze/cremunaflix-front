import type { ApiError, Request } from '../../contracts';
import type { CreateRequestPayload } from '../../services';
import { requestsRepository, RequestsRepository } from '../repositories/requests.repository';

export type CreateRequestResult =
  | { ok: true; data: Request }
  | { ok: false; error: ApiError };

const isApiError = (value: unknown): value is ApiError =>
  Boolean(value && typeof value === 'object' && 'code' in value && 'message' in value);

/**
 * Validates and creates a new request.
 */
export class CreateRequestCommand {
  private repository: RequestsRepository;

  constructor(repository: RequestsRepository = requestsRepository) {
    this.repository = repository;
  }

  async execute(payload: CreateRequestPayload): Promise<CreateRequestResult> {
    const title = payload.title.trim();
    const requestedById = payload.requestedById.trim();
    const reason = payload.reason.trim();
    const link = payload.link.trim();

    if (!title) {
      return {
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Titulo obrigatorio.' }
      };
    }

    if (!requestedById) {
      return {
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Identificador obrigatorio.' }
      };
    }

    if (!reason) {
      return {
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Motivo obrigatorio.' }
      };
    }

    if (link) {
      try {
        new URL(link);
      } catch {
        return {
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: 'Link invalido.' }
        };
      }
    }

    try {
      const created = await this.repository.createRequest({ title, link, reason, requestedById });
      return { ok: true, data: created };
    } catch (error) {
      if (isApiError(error)) {
        return { ok: false, error };
      }

      return {
        ok: false,
        error: { code: 'UNKNOWN_ERROR', message: 'Erro inesperado.', details: String(error) }
      };
    }
  }
}

export const createRequestCommand = new CreateRequestCommand();
