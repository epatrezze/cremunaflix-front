import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Request } from '../../contracts';
import { apiClient } from '../../services';
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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState({
    title: '',
    link: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await apiClient.listRequests();
      if (mounted) {
        setRequests(data.items);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Handles request form submission.
   *
   * @param event - Form submission event.
   * @returns Promise resolved after handling the submit.
   */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    const title = formState.title.trim();
    const link = formState.link.trim();
    const reason = formState.reason.trim();

    if (!title) {
      setFeedback({ type: 'error', message: 'Informe um titulo para continuar.' });
      return;
    }
    if (!reason) {
      setFeedback({ type: 'error', message: 'Explique o motivo do pedido.' });
      return;
    }
    if (link) {
      try {
        new URL(link);
      } catch {
        setFeedback({ type: 'error', message: 'O link informado nao parece valido.' });
        return;
      }
    }
    setSubmitting(true);
    try {
      const created = await apiClient.createRequest({ title, link, reason });
      setRequests((prev) => [created, ...prev]);
      setFormState({ title: '', link: '', reason: '' });
      setFeedback({ type: 'success', message: 'Pedido enviado com sucesso.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Nao foi possivel enviar o pedido.' });
    } finally {
      setSubmitting(false);
    }
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
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Digite o nome do filme"
              required
            />
          </div>
          <div>
            <label htmlFor="link">Link</label>
            <input
              id="link"
              type="url"
              value={formState.link}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, link: event.target.value }))
              }
              placeholder="IMDb, Letterboxd, trailer"
            />
          </div>
          <div>
            <label htmlFor="reason">Motivo</label>
            <textarea
              id="reason"
              value={formState.reason}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, reason: event.target.value }))
              }
              placeholder="Por que devemos exibir?"
              rows={4}
              required
            />
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
