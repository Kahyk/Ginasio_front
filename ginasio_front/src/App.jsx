import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CalendarioView from './views/CalendarioView';


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
        return <h4>Tela de Gestão de Reservas (Em construção)</h4>;
      case 'Espaços':
        return <h4>Tela de Gestão de Espaços (Em construção)</h4>;
      case 'Usuários':
        return <h4>Tela de Gestão de Usuários (Em construção)</h4>;
      default:
        return <h4>Tela não encontrada</h4>;
    }
  };

return (
    // mudança das cores Colocamos o bg-body-tertiary e text-body no container mestre
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