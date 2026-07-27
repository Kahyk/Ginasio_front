import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CalendarioView from './views/CalendarioView';
import UsuariosView from './views/UsuariosView';
import Login from './views/Login';
import CadastroFuncionario from './views/CadastroFuncionario';
import ReservasView from './views/ReservasView';
import EspacosView from './views/EspacosView';


function App() {
  
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'Dashboard';
  });
  
  const [autenticado, setAutenticado] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [publicView, setPublicView] = useState('login');

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    if (autenticado) {
      const splashMostrado = sessionStorage.getItem('splashMostrado');
      
      if (!splashMostrado) {
        setShowSplash(true);
        sessionStorage.setItem('splashMostrado', 'true');
        
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [autenticado]);

  const renderView = () => {
    switch (currentView) {
      case 'Tela Inicial':
      case 'Dashboard':
        return <DashboardView setCurrentView={setCurrentView}/>;
      case 'Calendário':
        return <CalendarioView />;
      case 'Reservas':
        return <ReservasView />;
      case 'Espaços':
        return <EspacosView />;
      case 'Usuários':
        return <UsuariosView />;
      default:
        return <h4>Tela não encontrada</h4>;
    }
  };

  if (!autenticado) {
    if (publicView === 'cadastro-funcionario') {
      return (
        <CadastroFuncionario
          onBackToLogin={() => setPublicView('login')}
        />
      );
    }

    return (
      <Login
        setAutenticado={setAutenticado}
        onOpenCadastroFuncionario={() => setPublicView('cadastro-funcionario')}
      />
    );
  }

  //Tela de Boas-vindas
  if (showSplash) {
    return (
      <div 
        className="vh-100 vw-100 d-flex flex-column align-items-center justify-content-center text-white position-relative overflow-hidden" 
        style={{ backgroundColor: 'var(--unifor-blue, #005baa)', transition: 'opacity 0.5s ease-in-out' }}
      >
        
        {/*LOGO NO FUNDO */}
        <img 
          src="/Brasao_unifor-removebg-preview.png" 
          alt="Marca d'água UNIFOR"
          style={{
            position: 'absolute',
            left: '-15%', 
            top: '50%',
            transform: 'translateY(-50%)', 
            height: '140vh', 
            opacity: 0.15, 
            pointerEvents: 'none' 
          }}
        />

        {/* Textos e Spinner */}
        <div className="text-center" style={{ zIndex: 1 }}>
          <h1 className="fw-bolder display-1 mb-0" style={{ letterSpacing: '-2px' }}>UNIFOR</h1>
          <p className="fs-5 opacity-75 mb-4">Gestão Complexo Esportivo</p>
          <div className="spinner-border spinner-border-sm opacity-50" role="status" aria-hidden="true"></div>
        </div>
        
      </div>
    );
  }

return (
    
    <div className="d-flex vh-100 vw-100 bg-body-tertiary text-body" style={{ overflow: "hidden" }}>
      
      <Sidebar 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      setAutenticado={setAutenticado} 
      />
      
      {/* garantia que o fundo se adapte */}
      <div className="flex-grow-1 p-4 overflow-auto bg-body-tertiary">
        {renderView()}
      </div>
      
    </div>
  );
}

export default App;
