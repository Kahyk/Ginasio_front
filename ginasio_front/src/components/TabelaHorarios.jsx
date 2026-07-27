import { Table } from 'react-bootstrap';
import { BiLockAlt } from 'react-icons/bi';

const TabelaHorarios = ({ locais, reservas = [], onSlotClick }) => {
  const horarios = ['07:00', '08:30', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30', '20:00'];

  
  const mapLocaisIds = {
    'Quadra Poliesportiva 1': 'uuid-quadra-001',
    'Quadra Poliesportiva 2': 'uuid-quadra-002',
    'Sala Multifuncional': 'uuid-sala-001',
    'Raia 1': 'uuid-raia-001',
    'Raia 2': 'uuid-raia-002',
    'Raia 3': 'uuid-raia-003',
    'Área de Lazer': 'uuid-lazer-001',
    'Quadra Saibro': 'uuid-saibro-001',
    'Quadra Rápida 1': 'uuid-rapida-001',
    'Quadra Rápida 2': 'uuid-rapida-002',
  };

  const verificarOcupacao = (horario, local) => {
    if (!reservas || reservas.length === 0) return null;

    return reservas.find(reserva => {
    
      const dataObj = new Date(reserva.date);
      const horaReserva = dataObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Fortaleza' 
      });

 
      const placeIdDestaColuna = mapLocaisIds[local];
      
      const bateuHorario = horaReserva === horario;
      const bateuLocal = reserva.placeId === placeIdDestaColuna || reserva.place?.name === local;

      
      const statusValido = reserva.status !== 'CANCELLED';

      return bateuHorario && bateuLocal && statusValido;
    });
  };

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
            
            {locais.map(local => {
              const reservaOcupando = verificarOcupacao(horario, local);

              return (
                <td key={local} className="p-2 bg-body-tertiary">
                  {reservaOcupando ? (
                    /* BLOCO OCUPADO */
                    <div 
                      className="d-flex flex-column justify-content-center align-items-center h-100 rounded border border-danger bg-danger bg-opacity-10 shadow-sm" 
                      style={{ cursor: 'not-allowed', minHeight: '50px' }}
                      title={`Reservado - Status: ${reservaOcupando.status}`}
                    >
                      <span className="text-danger small fw-bold"><BiLockAlt className="me-1 mb-1"/>Ocupado</span>
                    </div>
                  ) : (
                    /* BLOCO LIVRE */
                    <div 
                      onClick={() => onSlotClick({ horario, local })}
                      className="d-flex flex-column justify-content-center align-items-center h-100 rounded border border-secondary-subtle bg-body shadow-sm transition-all" 
                      style={{ cursor: 'pointer', minHeight: '50px' }}
                    >
                      <span className="text-success small fw-semibold">+ Livre</span>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TabelaHorarios;
