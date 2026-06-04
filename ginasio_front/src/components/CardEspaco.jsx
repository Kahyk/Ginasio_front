import { BiGroup, BiCalendarCheck, BiTime } from 'react-icons/bi';

const CardEspaco = ({ espaco }) => {
  return (
    <div className="card-unifor p-4 mb-3 border h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="fw-bold text-body mb-0 me-2">{espaco.nome}</h5>
      </div>

      <div className="mb-3 flex-grow-1">
        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
          <BiGroup size={18} />
          <span>Capacidade: {espaco.capacidade} pessoas</span>
        </div>

        <div className="d-flex align-items-center gap-2 text-muted small">
          <BiCalendarCheck size={18} />
          <span>{espaco.reservasConfirmadas} reservas confirmadas</span>
        </div>
      </div>

      <div className="text-muted small d-flex align-items-center gap-2">
        <BiTime size={18} />
        <span>Cadastrado recentemente</span>
      </div>
    </div>
  );
};

export default CardEspaco;
