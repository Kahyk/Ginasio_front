import { BiGroup, BiSun, BiCloudRain, BiCalendarCheck } from 'react-icons/bi';

export default function CardEspaco({ espaco }) {
  const getCorCategoria = (categoria) => {
    switch (categoria) {
      case 'Quadra Poliesportiva': return { bg: '#0d6efd20', text: '#0d6efd' };
      case 'Academia': return { bg: '#6f42c120', text: '#6f42c1' };
      case 'Piscina': return { bg: '#0dcaf020', text: '#0dcaf0' };
      case 'Estádio de Atletismo': return { bg: '#fd7e1420', text: '#fd7e14' };
      case 'Tênis': return { bg: '#19875420', text: '#198754' };
      case 'Beach Tênis': return { bg: '#ffc10720', text: '#ffc107' };
      case 'Área Verde': return { bg: '#28a74520', text: '#28a745' };
      default: return { bg: '#6c757d20', text: '#6c757d' };
    }
  };

  const cores = getCorCategoria(espaco.categoria);

  return (
    <div className="card-unifor bg-body p-4 mb-3 border h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="fw-bold text-body mb-0 me-2">{espaco.nome}</h5>
        <span 
          className="badge rounded-pill fw-bold" 
          style={{ backgroundColor: cores.bg, color: cores.text, fontSize: '12px' }}
        >
          {espaco.categoria}
        </span>
      </div>

      <div className="mb-3 flex-grow-1">
        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
          <BiGroup size={18} />
          <span className="text-body">Capacidade: {espaco.capacidade} pessoas</span>
        </div>
        
        <div className={`d-flex align-items-center gap-2 small mb-2 ${espaco.coberto ? 'text-success' : 'text-warning'}`}>
          {espaco.coberto ? <BiSun size={18} /> : <BiCloudRain size={18} />}
          <span className="text-body">{espaco.coberto ? 'Espaço coberto' : 'Área aberta (sujeita a clima)'}</span>
        </div>

        <div className="d-flex align-items-center gap-2 text-muted small">
          <BiCalendarCheck size={18} />
          <span className="text-body">{espaco.reservasConfirmadas} reservas confirmadas</span>
        </div>
      </div>

      <div>
        <span className="d-block text-muted small mb-2" style={{ fontSize: '11px' }}>Comodidades:</span>
        <div className="d-flex flex-wrap gap-2">
          {espaco.comodidades.map((item, index) => (
            <span key={index} className="border border-secondary-subtle rounded px-2 py-1 text-body bg-body-secondary" style={{ fontSize: '11px' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}