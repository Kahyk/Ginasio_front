import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { BiSearch, BiMapAlt, BiPlus } from 'react-icons/bi';
import CardEspaco from '../components/CardEspaco';
import api from '../services/api';

const EspacosView = () => {
  const [espacos, setEspacos] = useState([]);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    // Busca os espaços na rota do Back-end
    const carregarEspacos = async () => {
      try {
        const response = await api.get('/places');

        const espacosAdaptados = response.data.map((p) => ({
          id: p.id,
          nome: p.name,
          capacidade: p.capacity,
          reservasConfirmadas: p.schedulings ? p.schedulings.length : 0,
          criadoEm: p.createdAt,
        }));

        setEspacos(espacosAdaptados);
      } catch (error) {
        console.error("Erro ao buscar espaços:", error);
      }
    };

    carregarEspacos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setLoadingCreate(true);

    try {
      await api.post('/places', {
        name: formData.name,
        capacity: Number(formData.capacity)
      });

      setFormData({ name: '', capacity: '' });
      setSucesso('Espaço cadastrado com sucesso.');

      const response = await api.get('/places');
      const espacosAdaptados = response.data.map((p) => ({
        id: p.id,
        nome: p.name,
        capacidade: p.capacity,
        reservasConfirmadas: p.schedulings ? p.schedulings.length : 0,
        criadoEm: p.createdAt,
      }));

      setEspacos(espacosAdaptados);
    } catch (error) {
      console.error('Erro ao cadastrar espaço:', error);
      setErro(error.response?.data?.error || 'Não foi possível cadastrar o espaço.');
    } finally {
      setLoadingCreate(false);
    }
  };

  const metricas = useMemo(() => {
    const total = espacos.length;
    const capacidadeTotal = espacos.reduce((acc, espaco) => acc + Number(espaco.capacidade || 0), 0);
    const reservasTotal = espacos.reduce((acc, espaco) => acc + Number(espaco.reservasConfirmadas || 0), 0);
    return { total, capacidadeTotal, reservasTotal };
  }, [espacos]);

  const espacosFiltrados = useMemo(() => {
    return espacos.filter(espaco => {
      const bateTexto = espaco.nome.toLowerCase().includes(busca.toLowerCase());
      return bateTexto;
    });
  }, [espacos, busca]);

  return (
    <div className="h-100 d-flex flex-column">
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-body">Gestão de Espaços</h3>
        <p className="text-muted small mb-0">Cadastre e visualize os espaços disponíveis no complexo esportivo</p>
      </div>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}

      <div className="card-unifor p-4 mb-4 border">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0 text-body d-flex align-items-center gap-2">
            <BiPlus /> Novo Espaço
          </h6>
        </div>

        <Form onSubmit={handleSubmit} className="d-flex flex-column flex-md-row gap-3">
          <Form.Control
            type="text"
            placeholder="Nome do espaço"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Form.Control
            type="number"
            min="1"
            placeholder="Capacidade"
            value={formData.capacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
            required
            style={{ maxWidth: '180px' }}
          />
          <Button type="submit" className="fw-bold" style={{ backgroundColor: 'var(--unifor-blue)', border: 'none' }} disabled={loadingCreate}>
            {loadingCreate ? 'Cadastrando...' : 'Salvar espaço'}
          </Button>
        </Form>
      </div>

      {/* Cards de Resumo */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-primary mb-0">{metricas.total}</h3>
            <span className="text-muted small">Total de Espaços</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-success mb-0">{metricas.capacidadeTotal}</h3>
            <span className="text-muted small">Capacidade Total</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-warning mb-0">{metricas.reservasTotal}</h3>
            <span className="text-muted small">Reservas Vinculadas</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-purple mb-0" style={{ color: '#6f42c1' }}>{espacosFiltrados.length}</h3>
            <span className="text-muted small">Resultado da Busca</span>
          </div>
        </Col>
      </Row>

      {/* Barra de Pesquisa */}
      <div className="d-flex gap-3 mb-4 bg-body p-3 rounded card-unifor border">
        <InputGroup className="flex-grow-1 border rounded bg-body-secondary">
          <InputGroup.Text className="bg-transparent border-0 text-muted"><BiSearch size={20} /></InputGroup.Text>
          <Form.Control type="text" placeholder="Buscar espaço..." className="border-0 bg-transparent shadow-none" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </InputGroup>
      </div>

      <div className="flex-grow-1 overflow-auto pe-2 pb-4">
        {espacosFiltrados.length === 0 ? (
          <div className="bg-body-secondary rounded p-5 text-center border mb-4" style={{ borderStyle: 'dashed !important' }}>
            <p className="text-muted mb-0">Nenhum espaço encontrado.</p>
          </div>
        ) : (
          <div className="bg-body rounded p-4 border shadow-sm">
            <h6 className="fw-bold mb-4 text-body d-flex align-items-center gap-2"><BiMapAlt /> Espaços cadastrados</h6>
            <Row className="g-3">
              {espacosFiltrados.map(espaco => (
                <Col md={4} key={espaco.id}><CardEspaco espaco={espaco} /></Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspacosView;
