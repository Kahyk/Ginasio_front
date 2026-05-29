import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BiLock, BiCheckCircle, BiErrorCircle } from 'react-icons/bi';

const ModalSenha = ({ show, handleClose }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSalvar = () => {
    if (!novaSenha || !confirmaSenha) {
      setErro('Preencha os dois campos de senha.');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmaSenha) {
      setErro('As senhas não coincidem. Tente novamente.');
      return;
    }

    setErro('');
    setSucesso(true);
  };

  const fecharELimpar = () => {
    setNovaSenha('');
    setConfirmaSenha('');
    setErro('');
    setSucesso(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={fecharELimpar} centered backdrop="static">
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={fecharELimpar}></Modal.Header>
          <Modal.Body className="py-4">
            <BiCheckCircle size={80} className="text-success mb-3" />
            <h4 className="fw-bold text-body mb-3">Senha Atualizada!</h4>
            <p className="text-muted mb-0">Sua nova senha de acesso foi salva com sucesso.</p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="success" className="px-5 fw-bold shadow-sm" onClick={fecharELimpar}>
              Concluir
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <>
          <Modal.Header closeButton className="bg-primary text-white border-bottom-0">
            <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
              <BiLock /> Alterar Senha
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-muted">Nova Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => {
                  setNovaSenha(e.target.value);
                  setErro('');
                }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold small text-muted">Repita a Nova Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirme a nova senha"
                value={confirmaSenha}
                onChange={(e) => {
                  setConfirmaSenha(e.target.value);
                  setErro('');
                }}
              />
            </Form.Group>

            {erro && (
              <div className="text-danger small fw-bold mt-2 d-flex align-items-center gap-1">
                <BiErrorCircle /> {erro}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="bg-body-secondary border-top-0">
            <Button variant="outline-secondary" onClick={fecharELimpar}>Cancelar</Button>
            <Button variant="primary" onClick={handleSalvar} className="px-4 shadow-sm">
              Salvar Senha
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ModalSenha;