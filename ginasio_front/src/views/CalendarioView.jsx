import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BiLock } from 'react-icons/bi';
import TabelaHorarios from '../components/TabelaHorarios';

const CalendarioView = () => {
  // Pega a data de hoje formatada para o input do navegador
  const hoje = new Date().toISOString().split('T')[0];
  
  // Nossos controles de estado (Memória da tela)
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [complexoAtual, setComplexoAtual] = useState('Ginásio');

  return (
    <div className="h-100">
      {/* Cabeçalho Limpo - Estilo Figma */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-top border-primary border-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Calendário de Reservas</h4>
          <p className="text-muted small mb-0">Grade horária diária e visualização de blocos</p>
        </div>
        
        <div className="d-flex gap-3 align-items-center">
          {/* Dropdown Inteligente: Ao trocar aqui, a tabela inteira se redesenha */}
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

          {/* Seletor de Data */}
          <Form.Control 
            type="date" 
            value={dataSelecionada} 
            onChange={(e) => setDataSelecionada(e.target.value)} 
            className="form-control-sm border-0 bg-light shadow-sm text-muted" 
            style={{ width: '140px' }} 
          />
          
          <Button variant="danger" size="sm" className="px-3 fw-bold shadow-sm d-flex align-items-center gap-1">
            <BiLock size={18} /> Interditar
          </Button>
        </div>
      </div>

      {/* Container da Tabela */}
      <div className="card-unifor overflow-hidden border">
         {/* Passamos o complexo escolhido para a tabela saber quais colunas desenhar */}
         <TabelaHorarios complexoAtual={complexoAtual} />
      </div>
    </div>
  );
};

export default CalendarioView;