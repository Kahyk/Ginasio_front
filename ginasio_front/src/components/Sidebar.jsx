import { Nav } from "react-bootstrap";
import { BiHomeAlt, BiCalendar, BiNotepad, BiMapAlt, BiGroup, BiErrorCircle } from "react-icons/bi";

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: "Dashboard", icone: <BiHomeAlt size={20} /> },
    { id: "Calendário", icone: <BiCalendar size={20} /> },
    { id: "Reservas", icone: <BiNotepad size={20} /> },
    { id: "Espaços", icone: <BiMapAlt size={20} /> },
    { id: "Usuários", icone: <BiGroup size={20} /> },
  ];

  return (
    <div className="d-flex flex-column h-100 py-4 px-3 bg-white border-end">
      {/* Logo UNIFOR */}
      <div className="mb-5 px-3">
        <h3
          className="text-primary fw-bold mb-0"
          style={{ letterSpacing: "1px" }}
        >
          UNIFOR
        </h3>
        <small className="text-muted" style={{ fontSize: "12px" }}>
          Gestão Complexo Esportivo
        </small>
      </div>

      {/* Lista de Navegação */}
      <Nav className="flex-column gap-2 mb-auto">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`d-flex align-items-center gap-3 px-3 py-2 sidebar-item ${currentView === item.id ? "active" : ""}`}
          >
            {item.icone}
            <span>{item.id}</span>
          </div>
        ))}
      </Nav>

      {/* Alerta de Projeto no Rodapé */}
      <div className="mt-auto">
        <div
          className="p-3 rounded border border-warning bg-opacity-10 bg-warning"
          style={{ backgroundColor: "#fffdf5" }}
        >
          <div
            className="d-flex align-items-center gap-2 text-warning fw-bold mb-1"
            style={{ fontSize: "13px" }}
          >
            <BiErrorCircle size={16} /> Projeto de Extensão
          </div>
          <div className="text-muted" style={{ fontSize: "11px" }}>
            Desenvolvimento Web - UNIFOR
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
