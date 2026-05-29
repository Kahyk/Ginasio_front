import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { BiSearch, BiBuildings, BiUser, BiInfoCircle } from 'react-icons/bi';

const UsuariosView = () => {
  // Dados Mockados para construirmos a interface estática
  const assessorias = [
    {
      id: 1,
      nome: 'Assessoria Esportiva Pro',
      tipo: 'Assessoria - Horários Fixos',
      cnpj: '12.345.678/0001-90',
      email: 'contato@assessoriapro.com',
      telefone: '(85) 98765-4321',
    },
    {
      id: 2,
      nome: 'Academia Fitness Total',
      tipo: 'Assessoria - Horários Fixos',
      cnpj: '98.765.432/0001-00',
      email: 'fitness@total.com',
      telefone: '(85) 91234-5678',
    }
  ];

  const locatarios = [
    {
      id: 1,
      nome: 'João Silva',
      matricula: '2024001',
      cpf: '111.222.333-44',
      email: 'joao.silva@unifor.br',
      telefone: '(85) 99999-1111',
      reservas: 1
    },
    {
      id: 2,
      nome: 'Maria Santos',
      matricula: '2024002',
      cpf: '555.666.777-88',
      email: 'maria.santos@unifor.br',
      telefone: '(85) 99999-2222',
      reservas: 1
    }
  ];

  return (
    <div className="h-100">
      {/* Cabeçalho */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-dark">Gestão de Usuários</h3>
        <p className="text-muted small mb-0">Visualize e gerencie assessorias e locatários cadastrados</p>
      </div>

      {/* Cards de Resumo */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-primary mb-0">5</h2>
            <p className="text-muted small mb-0">Total de Usuários</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-danger mb-0">2</h2>
            <p className="text-muted small mb-0">Assessorias</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-success mb-0">3</h2>
            <p className="text-muted small mb-0">Locatários</p>
          </div>
        </Col>
      </Row>

      {/* Barra de Pesquisa e Filtro */}
      <div className="card-unifor p-3 mb-4 d-flex flex-row gap-3">
        <InputGroup className="flex-grow-1">
          <InputGroup.Text className="bg-light border-end-0">
            <BiSearch className="text-muted" />
          </InputGroup.Text>
          <Form.Control 
            className="bg-light border-start-0" 
            placeholder="Buscar por nome, CPF ou e-mail..." 
          />
        </InputGroup>
        <Form.Select style={{ width: '200px' }} className="bg-light">
          <option>Todos os Tipos</option>
          <option>Assessorias</option>
          <option>Locatários</option>
        </Form.Select>
      </div>

      {/* Lista de Assessorias */}
      <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
        <BiBuildings className="text-purple" style={{color: '#8a2be2'}} /> Assessorias Esportivas (2)
      </h6>
      <Row className="mb-4 g-3">
        {assessorias.map(ass => (
          <Col xs={12} key={ass.id}>
            <div className="card-unifor p-4">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="bg-opacity-10 rounded p-2" style={{ backgroundColor: '#f3e8ff', color: '#8a2be2' }}>
                  <BiBuildings size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{ass.nome}</h6>
                  <span className="badge rounded-pill" style={{ backgroundColor: '#f3e8ff', color: '#8a2be2', border: '1px solid #d8b4fe' }}>
                    {ass.tipo}
                  </span>
                </div>
              </div>
              <Row className="text-muted small">
                <Col md={4}><strong>CNPJ:</strong> <br/>{ass.cnpj}</Col>
                <Col md={4}><strong>E-mail:</strong> <br/>{ass.email}</Col>
                <Col md={4}><strong>Telefone:</strong> <br/>{ass.telefone}</Col>
              </Row>
            </div>
          </Col>
        ))}
      </Row>

      {/* Lista de Locatários Avulsos */}
      <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
        <BiUser className="text-success" /> Locatários Avulsos (3)
      </h6>
      <Row className="mb-4 g-3">
        {locatarios.map(loc => (
          <Col md={6} key={loc.id}>
            <div className="card-unifor p-4">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="bg-opacity-10 rounded p-2 text-success" style={{ backgroundColor: '#e6f4ea' }}>
                  <BiUser size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{loc.nome}</h6>
                  <span className="badge bg-light text-dark border">
                    Matrícula: {loc.matricula}
                  </span>
                </div>
              </div>
              <div className="text-muted small mb-3">
                <div><strong>CPF:</strong> {loc.cpf}</div>
                <div><strong>E-mail:</strong> {loc.email}</div>
                <div><strong>Telefone:</strong> {loc.telefone}</div>
              </div>
              <span className="badge bg-light text-dark border">{loc.reservas} reserva(s)</span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Box de Informações */}
      <div className="rounded p-4" style={{ backgroundColor: '#f0f7ff', border: '1px solid #cce3fd' }}>
        <h6 className="fw-bold text-primary mb-3">Tipos de Usuários</h6>
        
        <p className="fw-bold text-primary mb-1 small">Assessorias (Fixas):</p>
        <p className="text-primary mb-3 small">Possuem contrato e horários pré-definidos. Reservas recorrentes no sistema.</p>
        
        <p className="fw-bold text-primary mb-1 small">Locatários (Avulsos):</p>
        <p className="text-primary mb-0 small">Devem preencher Termo de Responsabilidade antes de utilizar os espaços. Requerem confirmação de pagamento para validação da reserva.</p>
      </div>
    </div>
  );
};

export default UsuariosView;