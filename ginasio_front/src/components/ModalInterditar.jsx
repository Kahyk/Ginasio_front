import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BiLock, BiLockOpen, BiCheckCircle, BiCalendarX } from 'react-icons/bi';
import api from '../services/api';

export default function ModalInterditar({ show, handleClose, dataSelecionada, complexoAtual, locais }) {
  const [localSelecionado, setLocalSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const formatarData = (data) => data.split('-').reverse().join('/');

  const handleInterditar = async () => {
    if (!localSelecionado) return alert("Selecione um espaço para interditar!");
    setLoading(true);

    try {
      // CORRIGIDO AQUI
      const token = localStorage.getItem('token');
      const configHeaders = { headers: { Authorization: `Bearer ${token}` } };

      const placesRes = await api.get('/places', configHeaders);
      const lugar = placesRes.data.find(p => p.name === localSelecionado);
      if (!lugar) throw new Error("Local não encontrado no banco.");

      const schedRes = await api.get('/schedulings', configHeaders);
      const reservasParaCancelar = schedRes.data.filter(r => {
        const dataLocal = new Date(r.date).toLocaleDateString('en-CA', { timeZone: 'America/Fortaleza' });
        return dataLocal === dataSelecionada && r.placeId === lugar.id && r.status !== 'CANCELLED';
      });

      for (let r of reservasParaCancelar) {
        await api.delete(`/schedulings/cancel/funcionario/${r.id}`, configHeaders);
      }

      sessionStorage.setItem(`interdito_${dataSelecionada}_${localSelecionado}`, 'true');

      setMensagemSucesso(`O espaço ${localSelecionado} foi totalmente bloqueado para manutenção. Grade horária trancada!`);
      setSucesso(true);
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao aplicar a interdição.");
    } finally {
      setLoading(false);
    }
  };

  const handleLiberar = async () => {
    if (!localSelecionado) return alert("Selecione um espaço para liberar!");
    
    setLoading(true);
    try {
      sessionStorage.removeItem(`interdito_${dataSelecionada}_${localSelecionado}`);
      setMensagemSucesso(`O espaço ${localSelecionado} foi liberado com sucesso e está pronto para novos agendamentos!`);
      setSucesso(true);
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao liberar o espaço.");
    } finally {
      setLoading(false);
    }
  };

  const fecharELimpar = () => {
    const precisaRecarregar = sucesso;
    setSucesso(false);
    setLocalSelecionado('');
    handleClose();
    if (precisaRecarregar) window.location.reload();
  };

  return (
    <Modal show={show} onHide={fecharELimpar} centered backdrop="static">
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={fecharELimpar}></Modal.Header>
          <Modal.Body className="py-4">
            <BiCheckCircle size={80} className="text-success mb-3" />
            <h4 className="fw-bold text-body mb-3">Controlo Concluído!</h4>
            <p className="text-muted mb-0">{mensagemSucesso}</p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="dark" className="px-5 fw-bold" onClick={fecharELimpar}>Fechar</Button>
          </Modal.Footer>
        </div>
      ) : (
        <>
          <Modal.Header closeButton className="bg-danger text-white border-bottom-0">
            <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
              <BiCalendarX /> Gerenciar Interdição
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <p className="text-muted small mb-4">A interdição <strong>removerá</strong> as reservas normais e bloqueará a grade horária.</p>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-body mb-1">Data Afetada</Form.Label>
              <Form.Control type="text" value={formatarData(dataSelecionada)} disabled className="bg-body-secondary text-muted fw-bold" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-body mb-1">Selecione o Espaço *</Form.Label>
              <Form.Select className="border-danger border-opacity-50 shadow-sm fw-semibold" value={localSelecionado} onChange={(e) => setLocalSelecionado(e.target.value)}>
                <option value="">-- Escolha o espaço --</option>
                {locais.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
              </Form.Select>
            </Form.Group>
            <Row className="g-2 mt-4">
              <Col xs={6}>
                <Button variant="outline-success" className="w-100 p-3 h-100 shadow-sm" onClick={handleLiberar} disabled={loading || !localSelecionado}>
                  <BiLockOpen size={24} className="mb-1" /><br/><span className="fw-bold small">Liberar Espaço</span>
                </Button>
              </Col>
              <Col xs={6}>
                <Button variant="danger" className="w-100 p-3 h-100 shadow-sm" onClick={handleInterditar} disabled={loading || !localSelecionado}>
                  {loading ? 'Aguarde...' : <><BiLock size={24} className="mb-1" /><br/><span className="fw-bold small">Interditar o Dia</span></>}
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}