import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CalendarioView from './views/CalendarioView';
import ReservasView from './views/ReservasView';
import EspacosView from './views/EspacosView';


function App() {
  const [currentView, setCurrentView] = useState('Dashboard');

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
        return <h4>Tela de Gestão de Usuários (Em construção)</h4>;
      default:
        return <h4>Tela não encontrada</h4>;
    }
  };

return (
    
    <div className="d-flex vh-100 vw-100 bg-body-tertiary text-body" style={{ overflow: "hidden" }}>
      
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* garantia que o fundo se adapte */}
      <div className="flex-grow-1 p-4 overflow-auto bg-body-tertiary">
        {renderView()}
      </div>
      
    </div>
  );
}

export default App;