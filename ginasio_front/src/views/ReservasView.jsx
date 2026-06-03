import { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import CardReserva from '../components/CardReserva';

export default function ReservasView() {
  const [reservas, setReservas] = useState([]);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos os Status');

  const carregarReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/schedulings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const adaptadas = data.map(r => ({
          id: r.id,
          espaco: r.place?.name || 'Espaço não informado',
          status: r.status === 'PENDING' ? 'Pendente' : (r.status === 'COMPLETED' || r.status === 'CONFIRMED') ? 'Confirmado' : 'Cancelado',
          data: new Date(r.date).toLocaleDateString('pt-BR'),
          horario: new Date(r.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          locatario: r.user?.name || 'Locatário Avulso',
          contato: r.user?.phone || 'Sem contato'
        }));
        setReservas(adaptadas);
      }
    } catch (error) {
      console.error("Erro ao carregar reservas", error);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleConfirmar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/schedulings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (response.ok) {
        carregarReservas(); 
      }
    } catch (error) {
      console.error("Erro ao confirmar", error);
    }
  };

  const handleDeletar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/schedulings/cancel/funcionario/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        carregarReservas(); 
      }
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  // A MÁGICA ACONTECE AQUI: Criamos a lista filtrada antes de renderizar
  const reservasFiltradas = reservas.filter(reserva => {
    const bateBusca = reserva.espaco.toLowerCase().includes(busca.toLowerCase()) || reserva.locatario.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = statusFiltro === 'Todos os Status' || reserva.status === statusFiltro;
    return bateBusca && bateStatus;
  });

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
          <option value="Cancelado">Cancelado</option>
        </Form.Select>
      </div>

      <div className="flex-grow-1 overflow-auto pe-2">
        <h6 className="fw-bold mb-3 text-body">Reservas ({reservasFiltradas.length})</h6>
        {reservasFiltradas.length === 0 ? (
           <div className="bg-body-secondary rounded p-5 text-center border" style={{ borderStyle: 'dashed !important' }}>
              <p className="text-muted mb-0">Nenhuma reserva encontrada para este filtro.</p>
           </div>
        ) : (
          /* Renderiza APENAS a lista filtrada, e não a lista inteira */
          reservasFiltradas.map(reserva => (
            <CardReserva key={reserva.id} reserva={reserva} onConfirmar={handleConfirmar} onDeletar={handleDeletar} />
          ))
        )}
      </div>
    </div>
  );
}