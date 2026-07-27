import { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import CardReserva from '../components/CardReserva';
import api from '../services/api';

const ReservasView = () => {
  const [reservas, setReservas] = useState([]);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos os Status');

  const carregarReservas = async () => {
    try {
      let response;

      try {
        response = await api.get('/schedulings');
      } catch (error) {
        if (error.response?.status === 401) {
          response = await api.get('/schedulings/me');
        } else {
          throw error;
        }
      }

      const adaptadas = response.data.map((r) => ({
        id: r.id,
        espaco: r.place?.name || 'Espaço não informado',
        status: r.status === 'PENDING' ? 'Pendente' : r.status === 'COMPLETED' ? 'Confirmado' : 'Cancelado',
        data: new Date(r.date).toLocaleDateString('pt-BR'),
        horario: new Date(r.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        locatario: r.reservationName || r.user?.name || 'Locatário Avulso',
        contato: r.reservationEmail || r.user?.phone || 'Sem contato',
        tag: r.reservationTypeUser === 'FUNCIONARIO' ? 'Funcionário' : 'Reserva'
      }));

      setReservas(adaptadas);
    } catch (error) {
      console.error("Erro ao carregar reservas", error);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleConfirmar = async (id) => {
    try {
      
      const response = await api.put(`/schedulings/${id}/status`, { status: 'COMPLETED' });
      if (response.status === 200) {
        carregarReservas(); 
      }
    } catch (error) {
      console.error("Erro ao confirmar", error);
    }
  };

  const handleDeletar = async (id) => {
    try {
      
      const response = await api.delete(`/schedulings/cancel/funcionario/${id}`);
      if (response.status === 200) {
        carregarReservas(); 
      }
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 text-body">Gestão de Reservas</h3>
          <p className="text-muted small mb-0">Visualize e gerencie todas as reservas do complexo esportivo</p>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4 bg-body p-3 rounded card-unifor border">
        <InputGroup className="flex-grow-1 border rounded bg-body-secondary">
          <InputGroup.Text className="bg-transparent border-0 text-muted"><BiSearch size={20} /></InputGroup.Text>
          <Form.Control type="text" placeholder="Buscar por espaço ou nome..." className="border-0 bg-transparent shadow-none" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </InputGroup>

        <Form.Select className="border shadow-none fw-semibold text-body bg-body-secondary" style={{ width: '220px', cursor: 'pointer' }} value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
          <option value="Todos os Status">Todos os Status</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Pendente">Pendente</option>
        </Form.Select>
      </div>

      <div className="flex-grow-1 overflow-auto pe-2">
        <h6 className="fw-bold mb-3 text-body">Reservas ({reservas.length})</h6>
        {reservas.length === 0 ? (
           <div className="bg-body-secondary rounded p-5 text-center border" style={{ borderStyle: 'dashed !important' }}>
              <p className="text-muted mb-0">Nenhuma reserva encontrada. Aguardando conexão com o servidor...</p>
           </div>
        ) : (
          reservas.map(reserva => (
            <CardReserva key={reserva.id} reserva={reserva} onConfirmar={handleConfirmar} onDeletar={handleDeletar} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReservasView;
