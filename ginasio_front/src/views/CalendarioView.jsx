import { useState, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BiLock } from 'react-icons/bi';
import TabelaHorarios from '../components/TabelaHorarios';
import ModalReserva from '../components/ModalReserva';
import ModalInterditar from '../components/ModalInterditar';

const CalendarioView = () => {
  const hoje = new Date().toISOString().split('T')[0];
  
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [complexoAtual, setComplexoAtual] = useState('Ginásio');
  
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [showModalInterditar, setShowModalInterditar] = useState(false);

  const locais = useMemo(() => {
    if (complexoAtual === 'Piscina') return ['Raia 1', 'Raia 2', 'Raia 3', 'Área de Lazer'];
    if (complexoAtual === 'Complexo de Tênis') return ['Quadra Saibro', 'Quadra Rápida 1', 'Quadra Rápida 2'];
    return ['Quadra Poliesportiva 1', 'Quadra Poliesportiva 2', 'Sala Multifuncional'];
  }, [complexoAtual]);

  const handleAbrirModalReserva = (slot) => {
    setSlotSelecionado(slot);
    setShowModalReserva(true);
  };

  return (
    <div className="h-100">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-top border-primary border-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Calendário de Reservas</h4>
          <p className="text-muted small mb-0">Grade horária diária e visualização de blocos</p>
        </div>
        
        <div className="d-flex gap-3 align-items-center">
          <Form.Select 
            size="sm" 
            className="border-0 bg-light shadow-sm fw-semibold text-primary" 
            style={{ width: '220px', cursor: 'pointer' }}
            value={complexoAtual} 
            onChange={(e) => setComplexoAtual(e.target.value)}
          >
            <option value="Ginásio">📍 Ginásio Poliesportivo</option>
            <option value="Piscina">📍 Complexo Aquático</option>
            <option value="Complexo de Tênis">📍 Quadras de Tênis</option>
          </Form.Select>

          <Form.Control 
            type="date" 
            value={dataSelecionada} 
            onChange={(e) => setDataSelecionada(e.target.value)} 
            className="form-control-sm border-0 bg-light shadow-sm text-muted" 
            style={{ width: '140px' }} 
          />
          
          <Button 
            variant="danger" 
            size="sm" 
            className="px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
            onClick={() => setShowModalInterditar(true)}
          >
            <BiLock size={18} /> Interditar
          </Button>
        </div>
      </div>

      <div className="card-unifor overflow-hidden border">
         <TabelaHorarios 
            locais={locais}
            onSlotClick={handleAbrirModalReserva} 
         />
      </div>

      <ModalReserva 
        show={showModalReserva} 
        handleClose={() => setShowModalReserva(false)}
        dataSelecionada={dataSelecionada}
        complexoAtual={complexoAtual}
        slotSelecionado={slotSelecionado}
      />

      <ModalInterditar 
        show={showModalInterditar}
        handleClose={() => setShowModalInterditar(false)}
        dataSelecionada={dataSelecionada}
        complexoAtual={complexoAtual}
        locais={locais} 
      />
    </div>
  );
};

export default CalendarioView;