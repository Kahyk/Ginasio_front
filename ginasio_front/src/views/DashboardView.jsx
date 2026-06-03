import { useState, useEffect } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { BiCalendarEdit, BiInfoCircle, BiCalendarAlt, BiTime, BiCheckCircle } from 'react-icons/bi';
import api from '../services/api';

export default function DashboardView({ setCurrentView }) {
  const [reservasProximas, setReservasProximas] = useState([]);

  const mapIdsParaNomes = {
    'uuid-quadra-001': 'Quadra Poliesportiva 1',
    'uuid-quadra-002': 'Quadra Poliesportiva 2',
    'uuid-sala-001': 'Sala Multifuncional',
    'uuid-raia-001': 'Raia 1',
    'uuid-raia-002': 'Raia 2',
    'uuid-raia-003': 'Raia 3',
    'uuid-lazer-001': 'Área de Lazer',
    'uuid-saibro-001': 'Quadra Saibro',
    'uuid-rapida-001': 'Quadra Rápida 1',
    'uuid-rapida-002': 'Quadra Rápida 2',
  };

  const todosFeriados = [
    { data: '2026-06-04', motivo: 'Corpus Christi' },
    { data: '2026-08-15', motivo: 'Nossa Senhora da Assunção' },
    { data: '2026-09-07', motivo: 'Independência do Brasil' },
    { data: '2026-10-12', motivo: 'Nossa Sra. Aparecida' },
    { data: '2026-11-02', motivo: 'Finados' },
    { data: '2026-11-15', motivo: 'Proclamação da República' }
  ];

  // Hoje no formato de texto para comparar os feriados
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const hojeString = `${ano}-${mes}-${dia}`;
  
  const feriadosProximos = todosFeriados.filter(feriado => feriado.data >= hojeString).slice(0, 3); 

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const resposta = await api.get('/schedulings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Zero as horas de hoje para comparar datas de forma justa
        const hojeObj = new Date();
        hojeObj.setHours(0, 0, 0, 0);

        const filtrados = resposta.data
          .filter(reserva => {
            // Converte a data do banco para objeto Date ignorando fusos
            const dataReservaObj = new Date(reserva.date);
            dataReservaObj.setHours(0, 0, 0, 0);
            
            const statusBackend = reserva.status?.toUpperCase();
            const estaConfirmado = statusBackend === 'COMPLETED' || statusBackend === 'CONFIRMED';
            
            return dataReservaObj >= hojeObj && estaConfirmado;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4); 

        setReservasProximas(filtrados);
      } catch (erro) {
        console.error("Erro ao carregar dados do dashboard:", erro);
      }
    };

    carregarDashboard();
  }, []);

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' });
  };
  
  const formatarHora = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza' });
  };

  return (
    <div className="h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 text-body">Tela Inicial</h3>
          <p className="text-muted small mb-0">Visão geral do complexo esportivo UNIFOR</p>
        </div>
        <Button onClick={() => setCurrentView('Calendário')} className="shadow-sm d-flex align-items-center gap-2 fw-semibold" style={{ backgroundColor: 'var(--unifor-blue)', border: 'none' }}>
          <BiCalendarEdit size={18} /> Realizar Agendamento
        </Button>
      </div>

      <Row>
        <Col xs={12} className="mb-4">
          <div className="card-unifor p-4">
            <h6 className="fw-bold mb-4 text-body">Inícios Próximos (Próximas Reservas)</h6>
            {reservasProximas.length === 0 ? (
              <div className="bg-body-secondary rounded p-5 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <BiInfoCircle size={32} className="mb-2 text-muted opacity-50" />
                <h6 className="text-muted fw-semibold mb-1">Nenhuma reserva próxima no momento</h6>
                <p className="text-muted small mb-0 opacity-75">Os agendamentos aparecerão aqui automaticamente após a confirmação no sistema.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {reservasProximas.map((reserva, index) => {
                  const nomeEspaco = reserva.place?.name || mapIdsParaNomes[reserva.placeId] || 'Espaço Esportivo';
                  const nomeResponsavel = reserva.user?.name || 'Responsável';

                  return (
                    <div key={index} className="d-flex align-items-center justify-content-between p-3 bg-body-secondary rounded border border-primary border-opacity-25 shadow-sm">
                      <div className="d-flex align-items-center gap-3">
                        <Badge bg="primary" className="p-2 text-white"><BiCheckCircle size={16} /></Badge>
                        <div>
                          <div className="fw-bold text-body">{nomeEspaco}</div>
                          <div className="text-muted small">Responsável: <strong>{nomeResponsavel}</strong></div>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold text-primary d-block fs-5">{formatarHora(reserva.date)}</span>
                        <span className="text-muted small">{formatarData(reserva.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Col>

        <Col xs={12}>
          <div className="card-unifor p-4 border-start border-warning border-4">
            <h6 className="fw-bold text-body mb-4 d-flex align-items-center gap-2"><BiCalendarAlt className="text-warning" /> Feriados e Recessos Próximos</h6>
            {feriadosProximos.length === 0 ? (
              <div className="bg-body-secondary rounded p-4 text-center border" style={{ borderStyle: 'dashed !important' }}>
                <p className="text-muted small mb-0 opacity-75">Nenhum feriado programado para os próximos dias.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {feriadosProximos.map((feriado, index) => (
                  <div key={index} className="d-flex align-items-center gap-3 p-3 bg-body-secondary rounded border border-warning border-opacity-25">
                    <Badge bg="warning" className="p-2 text-body"><BiTime size={16} /></Badge>
                    <div>
                      <div className="fw-bold text-body">{feriado.motivo}</div>
                      <div className="text-muted small">Bloqueio programado para <strong>{formatarData(feriado.data + 'T12:00:00Z')}</strong></div>
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
}