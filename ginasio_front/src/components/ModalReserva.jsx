import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BiUser, BiPhone, BiCheckCircle, BiCalendarAlt, BiErrorCircle } from 'react-icons/bi';

const ModalReserva = ({ show, handleClose, dataSelecionada, complexoAtual, slotSelecionado }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [vinculo, setVinculo] = useState('externo');
  const [matricula, setMatricula] = useState('');
  const [erros, setErros] = useState({});
  
  // estado pra controlar se mostra formulario ou a tela de sucesso
  const [sucesso, setSucesso] = useState(false);

  const handleTelefoneChange = (e) => {
    let valor = e.target.value.replace(/\D/g, ''); 
    if (valor.length > 11) valor = valor.slice(0, 11);

    let formatado = valor;
    if (valor.length > 7) {
      formatado = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      formatado = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }

    setTelefone(formatado);
    if (erros.telefone) setErros({ ...erros, telefone: null });
  };

  const handleMatriculaChange = (e) => {
    const valorSomenteNumeros = e.target.value.replace(/\D/g, '');
    if (valorSomenteNumeros.length <= 7) {
      setMatricula(valorSomenteNumeros);
      if (erros.matricula) setErros({ ...erros, matricula: null });
    }
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value);
    if (erros.nome) setErros({ ...erros, nome: null });
  };

  const handleSalvar = () => {
    let novosErros = {}; 

    if (!nome) novosErros.nome = "Preencha o nome completo.";

    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (!telefoneNumeros) {
      novosErros.telefone = "O WhatsApp é obrigatório.";
    } else if (telefoneNumeros.length < 11) {
      novosErros.telefone = "Faltam números (são 11 dígitos).";
    }

    if (vinculo !== 'externo') {
      if (!matricula) {
        novosErros.matricula = "A matrícula é obrigatória.";
      } else if (matricula.length < 7) {
        novosErros.matricula = "Faltam números (são 7 dígitos).";
      }
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return; 
    }
    

    setSucesso(true);
  };

  // função para limpar e resetar tudo quando o usuário finalizar ou fechar
  const finalizarEFechar = () => {
    setNome(''); 
    setTelefone(''); 
    setVinculo('externo'); 
    setMatricula(''); 
    setErros({});
    setSucesso(false); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={finalizarEFechar} size="lg" centered backdrop="static">
      
      {/* se sucesso, mostra a tela de confrimação */}
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={finalizarEFechar}></Modal.Header>
          <Modal.Body className="py-5">
            <div className="mb-4">
              <BiCheckCircle size={80} className="text-success" />
            </div>
            <h3 className="fw-bold text-dark mb-3">Reserva Confirmada!</h3>
            <p className="text-muted fs-5 mb-0">
              O espaço <strong>{complexoAtual} - {slotSelecionado?.local}</strong> foi reservado com sucesso para <strong>{nome}</strong> às <strong>{slotSelecionado?.horario}</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="success" size="lg" className="px-5 fw-bold shadow-sm" onClick={finalizarEFechar}>
              Concluir
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        /* caso nao, mostra o formulario normal */
        <>
          <Modal.Header closeButton className="bg-primary text-white border-bottom-0">
            <Modal.Title className="fw-bold fs-5">Novo Agendamento</Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4 border border-primary border-opacity-25">
              <div>
                <span className="text-muted small d-block">Espaço selecionado</span>
                <span className="fw-bold text-primary">{complexoAtual} - {slotSelecionado?.local}</span>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">Data e Hora</span>
                <span className="fw-bold text-dark">
                  <BiCalendarAlt className="me-1 mb-1"/> 
                  {dataSelecionada?.split('-').reverse().join('/')} às {slotSelecionado?.horario}
                </span>
              </div>
            </div>

            <Form>
              <h6 className="fw-bold text-muted mb-3">Dados do Responsável</h6>
              <Row className="g-3 mb-3">
                <Col md={7}>
                  <Form.Label className="fw-semibold small text-muted">Nome Completo *</Form.Label>
                  <div className="input-group">
                    <span className={`input-group-text bg-white ${erros.nome ? 'border-warning' : ''}`}><BiUser /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="Nome do responsável" 
                      value={nome} 
                      onChange={handleNomeChange}
                      className={erros.nome ? 'border-warning shadow-none' : ''}
                    />
                  </div>
                  {erros.nome && (
                    <div className="text-warning small fw-bold mt-1 d-flex align-items-center gap-1">
                      <BiErrorCircle /> {erros.nome}
                    </div>
                  )}
                </Col>

                <Col md={5}>
                  <Form.Label className="fw-semibold small text-muted">WhatsApp *</Form.Label>
                  <div className="input-group">
                    <span className={`input-group-text bg-white ${erros.telefone ? 'border-warning' : ''}`}><BiPhone /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="(85) 90000-0000" 
                      maxLength={15} 
                      value={telefone} 
                      onChange={handleTelefoneChange} 
                      className={erros.telefone ? 'border-warning shadow-none' : ''}
                    />
                  </div>
                  {erros.telefone && (
                    <div className="text-warning small fw-bold mt-1 d-flex align-items-center gap-1">
                      <BiErrorCircle /> {erros.telefone}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col md={4}>
                  <Form.Label className="fw-semibold small text-muted">Vínculo com a UNIFOR</Form.Label>
                  <Form.Select value={vinculo} onChange={(e) => {
                    setVinculo(e.target.value);
                    setErros({ ...erros, matricula: null }); 
                  }}>
                    <option value="externo">Público Externo</option>
                    <option value="aluno">Aluno / Ex-aluno</option>
                    <option value="colaborador">Colaborador</option>
                  </Form.Select>
                </Col>

                {vinculo !== 'externo' && (
                  <Col md={8}>
                    <Form.Label className="fw-bold small text-primary">Nº Matrícula *</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ex: 2410899" 
                      maxLength={7} 
                      value={matricula} 
                      onChange={handleMatriculaChange} 
                      className={erros.matricula ? 'border-warning shadow-none' : ''}
                    />
                    {erros.matricula && (
                      <div className="text-warning small fw-bold mt-1 d-flex align-items-center gap-1">
                        <BiErrorCircle /> {erros.matricula}
                      </div>
                    )}
                  </Col>
                )}
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer className="bg-light border-top-0">
            <Button variant="outline-secondary" onClick={finalizarEFechar}>Cancelar</Button>
            <Button variant="primary" onClick={handleSalvar} className="px-4 shadow-sm">
              <BiCheckCircle className="me-1"/> Confirmar Reserva
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ModalReserva;