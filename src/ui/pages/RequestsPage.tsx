import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Request } from '../../contracts';
import { apiClient } from '../../services';
import Badge from '../components/Badge';

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
    if (!formState.title || !formState.link || !formState.reason) {
      return;
    }
    setSubmitting(true);
    const created = await apiClient.createRequest(formState);
    setRequests((prev) => [created, ...prev]);
    setFormState({ title: '', link: '', reason: '' });
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
              required
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
        </form>
        <div>
          <h2>Pedidos recentes</h2>
          <div className="request-list">
            {loading ? (
              <p>Carregando pedidos...</p>
            ) : (
              requests.map((request) => (
                <article key={request.id} className="request-item">
                  <div className="request-header">
                    <h3>{request.title}</h3>
                    <Badge label={statusLabel[request.status]} />
                  </div>
                  <a
                    className="request-link"
                    href={request.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {request.link}
                  </a>
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
