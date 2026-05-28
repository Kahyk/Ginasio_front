import { useState } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { BiCalendarEdit, BiInfoCircle, BiCalendarAlt, BiTime } from 'react-icons/bi';

const DashboardView = ({ setCurrentView }) => {
  // parte vazia aguardando o banco de dados
  const [reservasProximas] = useState([]);

  // lista de alguns feriados de 2026 pra exemplo
  const todosFeriados = [
    { data: '2026-06-04', motivo: 'Corpus Christi' },
    { data: '2026-08-15', motivo: 'Nossa Senhora da Assunção' },
    { data: '2026-09-07', motivo: 'Independência do Brasil' },
    { data: '2026-10-12', motivo: 'Nossa Sra. Aparecida' },
    { data: '2026-11-02', motivo: 'Finados' },
    { data: '2026-11-15', motivo: 'Proclamação da República' },
    { data: '2026-11-20', motivo: 'Dia da Consciência Negra' },
    { data: '2026-12-25', motivo: 'Natal' }
  ];

  // filtro pega a data exata de hoje e mostra apenas feriados futuros
  const hoje = new Date().toISOString().split('T')[0];
  const feriadosProximos = todosFeriados
    .filter(feriado => feriado.data >= hoje)
    .slice(0, 3); 

  const formatarData = (dataIso) => {
    return dataIso.split('-').reverse().join('/');
  };

  return (
    <div className="h-100">
      {/* cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 text-body">Tela Inicial</h3>
          <p className="text-muted small mb-0">Visão geral do complexo esportivo UNIFOR</p>
        </div>
        {/* botão para mudar para o calendário */}
        <Button 
          onClick={() => setCurrentView('Calendário')}
          className="shadow-sm d-flex align-items-center gap-2 fw-semibold" 
          style={{ backgroundColor: 'var(--unifor-blue)', border: 'none' }}
        >
          <BiCalendarEdit size={18} /> Realizar Agendamento
        </Button>
      </div>

      <Row>
        {/* card 1: inicios proximos */}
        <Col xs={12} className="mb-4">
          <div className="card-unifor p-4">
            <h6 className="fw-bold mb-4 text-body">Inícios Próximos (Reservas Confirmadas)</h6>
            
            {reservasProximas.length === 0 ? (
              <div className="bg-body-secondary rounded p-5 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <BiInfoCircle size={32} className="mb-2 text-muted opacity-50" />
                <h6 className="text-muted fw-semibold mb-1">Nenhuma reserva próxima no momento</h6>
                <p className="text-muted small mb-0 opacity-75">
                  Os agendamentos aparecerão aqui automaticamente quando o sistema for conectado ao servidor.
                </p>
              </div>
            ) : (
              <div>{/* Renderização futura do Back-end */}</div>
            )}
          </div>
        </Col>

        {/* Card 2: feriados */}
        <Col xs={12}>
          <div className="card-unifor p-4 border-start border-warning border-4">
            <h6 className="fw-bold text-body mb-4 d-flex align-items-center gap-2">
              <BiCalendarAlt className="text-warning" /> Feriados e Recessos Próximos
            </h6>
            
            {feriadosProximos.length === 0 ? (
              <div className="bg-body-secondary rounded p-4 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <p className="text-muted small mb-0 opacity-75">
                  Nenhum feriado programado para os próximos dias.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {feriadosProximos.map((feriado, index) => (
                  <div key={index} className="d-flex align-items-center gap-3 p-3 bg-body-secondary rounded border border-warning border-opacity-25">
                    <Badge bg="warning" className="p-2 text-body"><BiTime size={16} /></Badge>
                    <div>
                      <div className="fw-bold text-body">{feriado.motivo}</div>
                      <div className="text-muted small">
                        Bloqueio do complexo programado para <strong>{formatarData(feriado.data)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardView;