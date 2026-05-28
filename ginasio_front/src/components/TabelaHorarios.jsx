import { Table } from 'react-bootstrap';

const TabelaHorarios = ({ complexoAtual }) => {
  // Horários padrão da grade da UNIFOR
  const horarios = ['07:00', '08:30', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30', '20:00'];
  
  // Regra de negócio: Quais espaços existem em cada complexo?
  const getLocais = () => {
    if (complexoAtual === 'Piscina') return ['Raia 1', 'Raia 2', 'Raia 3', 'Área de Lazer'];
    if (complexoAtual === 'Complexo de Tênis') return ['Quadra Saibro', 'Quadra Rápida 1', 'Quadra Rápida 2'];
    return ['Quadra Poliesportiva 1', 'Quadra Poliesportiva 2', 'Sala Multifuncional'];
  };

  const locais = getLocais();

  return (
    <Table hover responsive className="text-center align-middle m-0" style={{ borderCollapse: 'collapse' }}>
      <thead className="bg-light border-bottom">
        <tr>
          <th className="py-3 text-muted fw-semibold border-end" style={{ width: '120px' }}>Horário</th>
          {locais.map(local => (
            <th key={local} className="py-3 text-dark fw-semibold">{local}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horarios.map(horario => (
          <tr key={horario} style={{ height: '70px' }}>
            {/* Coluna fixa de Horário na esquerda */}
            <td className="fw-bold text-muted border-end bg-light">{horario}</td>
            
            {/* Desenhando os "slots" de agendamento (Gavetas vazias) */}
            {locais.map(local => (
              <td key={local} className="p-2" style={{ backgroundColor: '#fafafa' }}>
                <div 
                  className="d-flex flex-column justify-content-center align-items-center h-100 rounded border border-light bg-white shadow-sm transition-all" 
                  style={{ cursor: 'pointer', minHeight: '50px' }}
                >
                  <span className="text-success small fw-semibold">+ Livre</span>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TabelaHorarios;