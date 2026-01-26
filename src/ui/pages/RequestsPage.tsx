import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Request } from '../../contracts';
import { requestsRepository } from '../../domain/repositories/requests.repository';
import { createRequestCommand } from '../../domain/commands/create-request.command';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import SkeletonList from '../components/SkeletonList';

/**
 * Maps request status to display labels.
 */
const statusLabel: Record<Request['status'], string> = {
  OPEN: 'Em avaliacao',
  APPROVED: 'Aprovado',
  DECLINED: 'Recusado'
};

/**
 * Requests page with submission form and list.
 *
 * @returns Requests page section.
 */
const RequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [formState, setFormState] = useState({
    title: '',
    link: '',
    reason: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    link: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await requestsRepository.listRequests();
        if (mounted) {
          setRequests(data.items);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: string }).message)
              : 'Nao foi possivel carregar os pedidos.';
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [reloadToken]);

  /**
   * Handles request form submission.
   *
   * @param event - Form submission event.
   * @returns Promise resolved after handling the submit.
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setFieldErrors({ title: '', link: '', reason: '' });
    const title = formState.title.trim();
    const link = formState.link.trim();
    const reason = formState.reason.trim();

    if (!title) {
      setFeedback({ type: 'error', message: 'Informe um titulo para continuar.' });
      setFieldErrors({ title: 'Titulo obrigatorio.', link: '', reason: '' });
      titleRef.current?.focus();
      return;
    }
    if (!reason) {
      setFeedback({ type: 'error', message: 'Explique o motivo do pedido.' });
      setFieldErrors({ title: '', link: '', reason: 'Motivo obrigatorio.' });
      reasonRef.current?.focus();
      return;
    }
    if (link) {
      try {
        new URL(link);
      } catch {
        setFeedback({ type: 'error', message: 'O link informado nao parece valido.' });
        setFieldErrors({ title: '', link: 'Link invalido.', reason: '' });
        linkRef.current?.focus();
        return;
      }
    }
    setSubmitting(true);
    const result = await createRequestCommand.execute({ title, link, reason });
    if (result.ok) {
      setRequests((prev) => [result.data, ...prev]);
      setFormState({ title: '', link: '', reason: '' });
      setFeedback({ type: 'success', message: 'Pedido enviado com sucesso.' });
    } else {
      setFeedback({ type: 'error', message: result.error.message });
    }
    setSubmitting(false);
  };

  return (
    <section>
      <header>
        <h1 className="page-title">Pedidos</h1>
        <p className="page-subtitle">
          Sugira filmes e ajude a curadoria a montar as proximas sessoes no Discord.
        </p>
      </header>
      <div className="request-grid">
        <form className="request-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Titulo</label>
            <input
              id="title"
              type="text"
              ref={titleRef}
              value={formState.title}
              onChange={(event) => {
                const value = event.target.value;
                setFormState((prev) => ({ ...prev, title: value }));
                if (fieldErrors.title) {
                  setFieldErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Digite o nome do filme"
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
              required
            />
            {fieldErrors.title && (
              <p id="title-error" className="field-error">
                {fieldErrors.title}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="link">Link</label>
            <input
              id="link"
              type="url"
              ref={linkRef}
              value={formState.link}
              onChange={(event) => {
                const value = event.target.value;
                setFormState((prev) => ({ ...prev, link: value }));
                if (fieldErrors.link) {
                  setFieldErrors((prev) => ({ ...prev, link: '' }));
                }
              }}
              placeholder="IMDb, Letterboxd, trailer"
              aria-invalid={Boolean(fieldErrors.link)}
              aria-describedby={fieldErrors.link ? 'link-error' : undefined}
            />
            {fieldErrors.link && (
              <p id="link-error" className="field-error">
                {fieldErrors.link}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="reason">Motivo</label>
            <textarea
              id="reason"
              ref={reasonRef}
              value={formState.reason}
              onChange={(event) => {
                const value = event.target.value;
                setFormState((prev) => ({ ...prev, reason: value }));
                if (fieldErrors.reason) {
                  setFieldErrors((prev) => ({ ...prev, reason: '' }));
                }
              }}
              placeholder="Por que devemos exibir?"
              rows={4}
              aria-invalid={Boolean(fieldErrors.reason)}
              aria-describedby={fieldErrors.reason ? 'reason-error' : undefined}
              required
            />
            {fieldErrors.reason && (
              <p id="reason-error" className="field-error">
                {fieldErrors.reason}
              </p>
            )}
          </div>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar pedido'}
          </button>
          {feedback && (
            <p className={`request-feedback ${feedback.type}`} aria-live="polite">
              {feedback.message}
            </p>
          )}
        </form>
        <div>
          <h2>Pedidos recentes</h2>
          <div className="request-list">
            {loading ? (
              <SkeletonList count={3} containerClassName="request-list" itemClassName="request-item" />
            ) : error ? (
              <EmptyState
                title="Falha ao carregar"
                description={error}
                actionLabel="Tentar novamente"
                onAction={() => setReloadToken((prev) => prev + 1)}
              />
            ) : requests.length === 0 ? (
              <EmptyState
                title="Nenhum pedido ainda"
                description="Seja a primeira pessoa a sugerir um filme para a comunidade."
                actionLabel="Fazer pedido"
                onAction={() => titleRef.current?.focus()}
              />
            ) : (
              requests.map((request) => (
                <article key={request.id} className="request-item">
                  <div className="request-header">
                    <h3>{request.title}</h3>
                    <Badge label={statusLabel[request.status]} />
                  </div>
                  {request.link && (
                    <a
                      className="request-link"
                      href={request.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {request.link}
                    </a>
                  )}
                  <p>{request.reason}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestsPage;
