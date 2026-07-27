import { useState } from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { BiHomeAlt, BiCalendar, BiNotepad, BiMapAlt, BiGroup, BiErrorCircle, BiCog, BiLock, BiMoon, BiSun, BiLogOut } from "react-icons/bi";
import ModalSenha from "./ModalSenha";

const Sidebar = ({ currentView, setCurrentView,setAutenticado}) => {
const [temaEscuro, setTemaEscuro] = useState(false);
const [showModalSenha, setShowModalSenha] = useState(false);

  
  const alternarTema = () => {
    const novoTema = !temaEscuro;
    setTemaEscuro(novoTema);
    document.documentElement.setAttribute('data-bs-theme', novoTema ? 'dark' : 'light');
  };

  const menuItems = [
    { id: "Tela Inicial", icone: <BiHomeAlt size={20} /> },
    { id: "Calendário", icone: <BiCalendar size={20} /> },
    { id: "Reservas", icone: <BiNotepad size={20} /> },
    { id: "Espaços", icone: <BiMapAlt size={20} /> },
    { id: "Usuários", icone: <BiGroup size={20} /> },
  ];

  return (
    <>
      <div className="d-flex flex-column h-100 py-4 px-3 bg-body-tertiary border-end transition-all">
        {/* logo da unifor */}
        <div className="mb-5 px-3">
          <h3 className="text-primary fw-bold mb-0" style={{ letterSpacing: "1px" }}>
            UNIFOR
          </h3>
          <small className="text-muted" style={{ fontSize: "12px" }}>
            Gestão Complexo Esportivo
          </small>
        </div>

        {/* a lista de navegação */}
        <Nav className="flex-column gap-2 mb-auto">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{ cursor: "pointer" }}
              className={`d-flex align-items-center gap-3 px-3 py-2 rounded transition-all ${
                currentView === item.id 
                  ? "bg-primary text-white fw-bold shadow-sm" 
                  : "text-body hover-bg-body-secondary"
              }`}
            >
              {item.icone}
              <span>{item.id}</span>
            </div>
          ))}
        </Nav>

       {/* o rodapé */}

      <div className="mt-auto">
          <div
            className={`p-3 rounded mb-3 ${temaEscuro ? 'border border-secondary bg-dark' : ''}`}
            style={{ 
              backgroundColor: temaEscuro ? 'transparent' : '#fdf8ec', 
              border: temaEscuro ? '' : 'none' 
          }}
          >
        
      <div 
          className={`d-flex align-items-center gap-2 fw-bold mb-1 ${temaEscuro ? 'text-light' : ''}`} 
          style={{ 
            fontSize: "13px", 
            color: temaEscuro ? '' : '#c26a0b' 
          }}
      >
          
      <BiErrorCircle size={16} /> Projeto de Extensão
        </div>
        <div 
          className={temaEscuro ? 'text-muted' : ''} 
          style={{ 
            fontSize: "11px", 
            color: temaEscuro ? '' : '#c26a0b' 
          }}
        >

        Desenvolvimento Web - UNIFOR
        </div>
      </div>

          {/* as configuracoes e loggout */}
          <Dropdown drop="up" className="w-100 border-top pt-3">
            <Dropdown.Toggle 
              variant={temaEscuro ? "dark" : "light"} 
              id="dropdown-config"
              className="w-100 d-flex align-items-center justify-content-between border-0 shadow-sm text-body fw-bold py-2"
            >
              <div className="d-flex align-items-center gap-2">
                <BiCog size={20} />
                <span>Configurações</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100 shadow border mb-2 rounded-3">
              <Dropdown.Item onClick={() => setShowModalSenha(true)} className="d-flex align-items-center gap-2 py-2">
                <BiLock size={18} /> Alterar Senha
              </Dropdown.Item>
              
              <Dropdown.Item onClick={alternarTema} className="d-flex align-items-center gap-2 py-2">
                {temaEscuro ? (
                  <><BiSun size={18}/> Tema Claro</>
                ) : (
                  <><BiMoon size={18} /> Tema Escuro</>
                )}
              </Dropdown.Item>
              
              <Dropdown.Divider />
              
              <Dropdown.Item 
                onClick={() => setAutenticado(false)} 
                className="text-danger fw-bold d-flex align-items-center gap-2 py-2"
              >
                <BiLogOut size={18} /> Sair do Sistema
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* renderiza o modal invisivel */}
      <ModalSenha show={showModalSenha} handleClose={() => setShowModalSenha(false)} />
    </>
  );
};

export default Sidebar;
