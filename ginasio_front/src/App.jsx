import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
    <Container fluid className="p-0 h-100" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Row className="g-0 h-100">
        <Col xs={2} style={{ height: '100vh', position: 'fixed', zIndex: 10 }}>
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        </Col>
        
        <Col xs={{ span: 10, offset: 2 }} className="p-5" style={{ backgroundColor: 'var(--unifor-bg)', minHeight: '100vh' }}>
          {renderView()}
        </Col>
      </Row>
    </Container>
  );
}

export default App;