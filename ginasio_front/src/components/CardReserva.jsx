CardReserva.jsx
import { Button, Badge } from 'react-bootstrap';
import { BiCheckCircle, BiTime, BiTrash } from 'react-icons/bi';

const CardReserva = ({ reserva, onConfirmar, onDeletar }) => {
  const isPendente = reserva.status === 'Pendente';

  return (
    <div className="card-unifor p-4 mb-3 border">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          {isPendente ? (
            <BiTime size={24} className="text-warning" />
          ) : (
            <BiCheckCircle size={24} className="text-success" />
          )}
          <h5 className="fw-bold text-body mb-0">{reserva.espaco}</h5>
          
          <Badge 
            className={`border fw-normal ${isPendente ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-success bg-opacity-10 text-success border-success'}`}
          >
            {reserva.status}
          </Badge>
          
          {reserva.tag && (
            <Badge bg="purple" style={{ backgroundColor: 'var(--bs-purple, #6f42c1)', color: 'white' }}>
              {reserva.tag}
            </Badge>
          )}
        </div>

        <div className="d-flex gap-2">
          {isPendente && (
            <Button variant="success" size="sm" className="fw-bold d-flex align-items-center gap-1 shadow-sm" onClick={() => onConfirmar(reserva.id)}>
              <BiCheckCircle size={18} /> Confirmar
            </Button>
          )}
          <Button variant="outline-secondary" size="sm" className="text-body border-0 bg-body-secondary" onClick={() => onDeletar(reserva.id)}>
            <BiTrash size={18} />
          </Button>
        </div>
      </div>

      <div className="row text-muted small mb-3">
        <div className="col-md-3">
          <span className="d-block text-secondary">Data</span>
          <strong className="text-body">{reserva.data}</strong>
        </div>
        <div className="col-md-3">
          <span className="d-block text-secondary">Horário</span>
          <strong className="text-body">{reserva.horario}</strong>
        </div>
        <div className="col-md-3">
          <span className="d-block text-secondary">Locatário</span>
          <strong className="text-body">{reserva.locatario}</strong>
        </div>
        <div className="col-md-3">
          <span className="d-block text-secondary">Contato</span>
          <strong className="text-body">{reserva.contato}</strong>
        </div>
      </div>

      {/* Áreas de Informação Extra */}
      {!isPendente && reserva.pagamento && (
        <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded p-2 mb-3 text-success small">
          <strong>Pagamento:</strong> {reserva.pagamento}
        </div>
      )}
      
      {reserva.observacoes && (
        <div className="bg-transparent border rounded p-2 small text-muted mb-3">
          <strong className="text-body">Observações:</strong> {reserva.observacoes}
        </div>
      )}

      {reserva.materiais && (
        <div className="small text-muted mb-1">
          <strong className="text-body">Materiais:</strong> {reserva.materiais}
        </div>
      )}
    </div>
  );
};

export default CardReserva;
