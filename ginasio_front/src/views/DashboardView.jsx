import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { BiCalendarEdit, BiInfoCircle, BiCalendarAlt } from 'react-icons/bi';

const DashboardView = () => {
  //  os dados vao ficar aqui quando o back for integrado
  // por hora estao vazios
  const [reservasProximas, setReservasProximas] = useState([]);
  const [feriados, setFeriados] = useState([]);

  return (
    <div className="h-100">
      {/* cabecalho  */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 text-dark">Dashboard</h3>
          <p className="text-muted small mb-0">Visão geral do complexo esportivo UNIFOR</p>
        </div>
        <Button 
          className="shadow-sm d-flex align-items-center gap-2 fw-semibold" 
          style={{ backgroundColor: 'var(--unifor-blue)', border: 'none' }}
        >
          <BiCalendarEdit size={18} /> Realizar Agendamento
        </Button>
      </div>

      <Row>
        {/* Card 1: Inicios Proximos */}
        <Col xs={12} className="mb-4">
          <div className="card-unifor p-4">
            <h6 className="fw-bold mb-4 text-dark">Inícios Próximos (Reservas Confirmadas)</h6>
            
            {/* Aguardando Banco de Dados */}
            {reservasProximas.length === 0 ? (
              <div className="bg-light rounded p-5 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <BiInfoCircle size={32} className="mb-2 text-muted opacity-50" />
                <h6 className="text-muted fw-semibold mb-1">Nenhuma reserva próxima no momento</h6>
                <p className="text-muted small mb-0 opacity-75">
                  Os agendamentos aparecerão aqui automaticamente quando o sistema for conectado ao servidor.
                </p>
              </div>
            ) : (
              <div>
                {/* O códigox que vai varrer o Banco de Dados virá para cá depois */}
              </div>
            )}
          </div>
        </Col>

        {/* Card 2: Feriados e Bloqueios */}
        <Col xs={12}>
          <div className="card-unifor p-4 border-start border-warning border-4">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <BiCalendarAlt className="text-warning" /> Feriados e Recessos Próximos
            </h6>
            
            {/* Aguardando Banco de Dados */}
            {feriados.length === 0 ? (
              <div className="bg-light rounded p-4 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <p className="text-muted small mb-0 opacity-75">
                  Nenhum bloqueio programado. O sistema está aguardando sincronização com o banco de dados.
                </p>
              </div>
            ) : (
              <div>
                {/* O código que vai listar os bloqueios do banco virá para cá depois */}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardView;