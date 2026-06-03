import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { BiSearch, BiMapAlt } from 'react-icons/bi';
import CardEspaco from '../components/CardEspaco';

const EspacosView = () => {
  const [espacos, setEspacos] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas as Categorias');

  useEffect(() => {
    const carregarEspacos = async () => {
      try {
        // CORRIGIDO AQUI
        const token = localStorage.getItem('token');
        
        if (!token) {
          window.location.href = '/login'; 
          return;
        }

        const response = await fetch('http://localhost:3000/places', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
          alert("Sua sessão expirou. Vamos te redirecionar para o login.");
          localStorage.removeItem('token'); // CORRIGIDO AQUI TAMBÉM
          window.location.href = '/login';
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          const espacosAdaptados = data.map(p => ({
            id: p.id,
            nome: p.name,
            capacidade: p.capacity,
            categoria: 'Quadra Poliesportiva', 
            coberto: true,
            reservasConfirmadas: p.schedulings ? p.schedulings.length : 0,
            comodidades: ['Padrão']
          }));
          setEspacos(espacosAdaptados);
        }
      } catch (error) {
        console.error("Erro ao buscar espaços:", error);
      }
    };

    carregarEspacos();
  }, []);

  const metricas = useMemo(() => {
    const total = espacos.length;
    const cobertos = espacos.filter(e => e.coberto).length;
    const abertos = total - cobertos;
    const categoriasUnicas = new Set(espacos.map(e => e.categoria)).size;
    return { total, cobertos, abertos, categoriasUnicas };
  }, [espacos]);

  const espacosFiltrados = useMemo(() => {
    return espacos.filter(espaco => {
      const bateTexto = espaco.nome.toLowerCase().includes(busca.toLowerCase());
      const bateCategoria = categoriaFiltro === 'Todas as Categorias' || espaco.categoria === categoriaFiltro;
      return bateTexto && bateCategoria;
    });
  }, [espacos, busca, categoriaFiltro]);

  const espacosAgrupados = espacosFiltrados.reduce((acc, espaco) => {
    if (!acc[espaco.categoria]) acc[espaco.categoria] = [];
    acc[espaco.categoria].push(espaco);
    return acc;
  }, {});

  return (
    <div className="h-100 d-flex flex-column">
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-body">Gestão de Espaços</h3>
        <p className="text-muted small mb-0">Visualize todos os espaços disponíveis no complexo esportivo</p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-primary mb-0">{metricas.total}</h3>
            <span className="text-muted small">Total de Espaços</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-success mb-0">{metricas.cobertos}</h3>
            <span className="text-muted small">Espaços Cobertos</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-warning mb-0">{metricas.abertos}</h3>
            <span className="text-muted small">Áreas Abertas</span>
          </div>
        </Col>
        <Col md={3}>
          <div className="card-unifor p-3 text-center border">
            <h3 className="fw-bold text-purple mb-0" style={{ color: '#6f42c1' }}>{metricas.categoriasUnicas}</h3>
            <span className="text-muted small">Categorias</span>
          </div>
        </Col>
      </Row>

      <div className="d-flex gap-3 mb-4 bg-body p-3 rounded card-unifor border">
        <InputGroup className="flex-grow-1 border rounded bg-body-secondary">
          <InputGroup.Text className="bg-transparent border-0 text-muted"><BiSearch size={20} /></InputGroup.Text>
          <Form.Control type="text" placeholder="Buscar espaço..." className="border-0 bg-transparent shadow-none" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </InputGroup>
        <Form.Select className="border shadow-none fw-semibold text-body bg-body-secondary" style={{ width: '220px', cursor: 'pointer' }} value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
          <option value="Todas as Categorias">Todas as Categorias</option>
          <option value="Quadra Poliesportiva">Quadras Poliesportivas</option>
          <option value="Academia">Academia</option>
        </Form.Select>
      </div>

      <div className="flex-grow-1 overflow-auto pe-2 pb-4">
        {espacos.length === 0 ? (
          <div className="bg-body-secondary rounded p-5 text-center border mb-4" style={{ borderStyle: 'dashed !important' }}>
            <p className="text-muted mb-0">Nenhum espaço carregado. Aguardando conexão com o servidor...</p>
          </div>
        ) : (
          Object.keys(espacosAgrupados).map(categoria => (
            <div key={categoria} className="mb-5 bg-body rounded p-4 border shadow-sm">
              <h6 className="fw-bold mb-4 text-body d-flex align-items-center gap-2"><BiMapAlt /> {categoria} ({espacosAgrupados[categoria].length})</h6>
              <Row className="g-3">
                {espacosAgrupados[categoria].map(espaco => (
                  <Col md={4} key={espaco.id}><CardEspaco espaco={espaco} /></Col>
                ))}
              </Row>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EspacosView;