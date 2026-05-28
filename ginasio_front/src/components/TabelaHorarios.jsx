import { Table } from 'react-bootstrap';

const TabelaHorarios = ({ locais, onSlotClick }) => {
  const horarios = ['07:00', '08:30', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30', '20:00'];

  return (
    <Table hover responsive className="text-center align-middle m-0" style={{ borderCollapse: 'collapse' }}>
      <thead className="bg-body-secondary border-bottom">
        <tr>
          <th className="py-3 text-muted fw-semibold border-end" style={{ width: '120px' }}>Horário</th>
          {locais.map(local => (
            <th key={local} className="py-3 text-body fw-semibold">{local}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horarios.map(horario => (
          <tr key={horario} style={{ height: '70px' }}>
            <td className="fw-bold text-muted border-end bg-body-secondary">{horario}</td>
            
            {locais.map(local => (
              <td key={local} className="p-2 bg-body-tertiary">
                <div 
                  onClick={() => onSlotClick({ horario, local })}
                  className="d-flex flex-column justify-content-center align-items-center h-100 rounded border border-secondary-subtle bg-body shadow-sm transition-all" 
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