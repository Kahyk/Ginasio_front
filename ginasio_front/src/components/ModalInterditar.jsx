import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BiLock, BiErrorCircle } from 'react-icons/bi';

const ModalInterditar = ({ show, handleClose, dataSelecionada, complexoAtual, locais }) => {
  const [motivo, setMotivo] = useState('');
  const [espacosSelecionados, setEspacosSelecionados] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
 
  useEffect(() => {
    if (show) {
      setMotivo('');
      setEspacosSelecionados([]);
      setErro('');
      setSucesso(false);
    }
  }, [show]);

  // função pra marcar e desmacar os espaços
  const handleToggleEspaco = (espaco) => {
    if (espacosSelecionados.includes(espaco)) {
      setEspacosSelecionados(espacosSelecionados.filter(item => item !== espaco));
    } else {
      setEspacosSelecionados([...espacosSelecionados, espaco]);
    }
    setErro('');
  };

  // função de selecionar tudo
  const handleToggleTodos = () => {
    if (espacosSelecionados.length === locais.length) {
      setEspacosSelecionados([]);
    } else {
      setEspacosSelecionados([...locais]);
    }
    setErro('');
  };

  const handleSalvar = () => {
    if (espacosSelecionados.length === 0) {
      setErro('Selecione pelo menos um espaço para interditar.');
      return;
    }
    if (!motivo) {
      setErro('Por favor, informe o motivo da interdição.');
      return;
    }

    // se sucesso, mostra tela de confirmação
    setSucesso(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={handleClose}></Modal.Header>
          <Modal.Body className="py-4">
            <BiLock size={80} className="text-danger mb-3" />
            <h4 className="fw-bold text-body mb-3">Área Interditada!</h4>
            <p className="text-muted mb-0">
              O bloqueio foi aplicado com sucesso em <strong>{espacosSelecionados.length}</strong> espaço(s) do <strong>{complexoAtual}</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="danger" className="px-5 fw-bold shadow-sm" onClick={handleClose}>
              Concluir
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <>
          <Modal.Header closeButton className="bg-danger text-white border-bottom-0">
            <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
              <BiLock /> Interditar Espaço
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <div className="mb-4">
              <h6 className="fw-bold text-body mb-1">Complexo Selecionado</h6>
              <p className="text-muted small mb-3">{complexoAtual} - {dataSelecionada?.split('-').reverse().join('/')}</p>
              
              {/* Lista de Checkboxes */}
              <div className="bg-body-secondary p-3 rounded border">
                <Form.Check 
                  type="checkbox"
                  id="check-todos"
                  label={<span className="fw-bold text-primary">Selecionar Todos</span>}
                  checked={espacosSelecionados.length === locais.length && locais.length > 0}
                  onChange={handleToggleTodos}
                  className="mb-2 pb-2 border-bottom"
                />
                
                {locais.map((local) => (
                  <Form.Check 
                    key={local}
                    type="checkbox"
                    id={`check-${local}`}
                    label={local}
                    checked={espacosSelecionados.includes(local)}
                    onChange={() => handleToggleEspaco(local)}
                    className="mb-1 text-muted"
                  />
                ))}
              </div>
            </div>

            <Form.Group>
              <Form.Label className="fw-semibold small text-muted">Motivo da Interdição *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Ex: Manutenção na rede elétrica, Chuva forte..."
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  setErro('');
                }}
                className={erro && !motivo ? 'border-danger shadow-none' : ''}
              />
            </Form.Group>

            {erro && (
              <div className="text-danger small fw-bold mt-2 d-flex align-items-center gap-1">
                <BiErrorCircle /> {erro}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="bg-body-secondary border-top-0">
            <Button variant="outline-secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="danger" onClick={handleSalvar} className="px-4 shadow-sm">
              <BiLock className="me-1"/> Confirmar Bloqueio
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ModalInterditar;
