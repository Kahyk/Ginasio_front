import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BiUser, BiPhone, BiCheckCircle, BiCalendarAlt, BiErrorCircle, BiIdCard } from 'react-icons/bi';
import api from '../services/api';

export default function ModalReserva({ show, handleClose, dataSelecionada, complexoAtual, slotSelecionado }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [vinculo, setVinculo] = useState('externo');
  const [matricula, setMatricula] = useState('');
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [espacosBanco, setEspacosBanco] = useState([]); 

  useEffect(() => {
    if (show) {
      const fetchPlaces = async () => {
        try {
          // CORRIGIDO AQUI
          const token = localStorage.getItem('token');
          const res = await api.get('/places', { headers: { Authorization: `Bearer ${token}` } });
          setEspacosBanco(res.data);
        } catch (err) { 
          console.error("Erro ao carregar locais:", err); 
        }
      };
      fetchPlaces();
    }
  }, [show]);

  const handleTelefoneChange = (e) => {
    let valor = e.target.value.replace(/\D/g, ''); 
    if (valor.length > 11) valor = valor.slice(0, 11);
    let formatado = valor;
    if (valor.length > 7) formatado = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    else if (valor.length > 2) formatado = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    setTelefone(formatado);
    if (erros.telefone) setErros({ ...erros, telefone: null });
  };

  const handleCpfChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    let formatado = valor;
    if (valor.length > 9) formatado = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9)}`;
    else if (valor.length > 6) formatado = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
    else if (valor.length > 3) formatado = `${valor.slice(0, 3)}.${valor.slice(3)}`;
    setCpf(formatado);
    if (erros.cpf) setErros({ ...erros, cpf: null });
  };

  const handleMatriculaChange = (e) => {
    const valorSomenteNumeros = e.target.value.replace(/\D/g, '');
    if (valorSomenteNumeros.length <= 7) {
      setMatricula(valorSomenteNumeros);
      if (erros.matricula) setErros({ ...erros, matricula: null });
    }
  };

  const handleSalvar = async () => {
    let novosErros = {}; 
    if (!nome) novosErros.nome = "Preencha o nome completo.";
    if (!dataNascimento) novosErros.dataNascimento = "Data é obrigatória.";

    const cpfNumeros = cpf.replace(/\D/g, '');
    if (!cpfNumeros || cpfNumeros.length < 11) novosErros.cpf = "CPF inválido.";

    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (!telefoneNumeros || telefoneNumeros.length < 11) novosErros.telefone = "WhatsApp inválido.";

    if (vinculo !== 'externo' && (!matricula || matricula.length < 7)) {
      novosErros.matricula = "Matrícula inválida (7 dígitos).";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return; 
    }
    
    setLoading(true);

    try {
      // CORRIGIDO AQUI
      const token = localStorage.getItem('token');
      const configHeaders = { headers: { Authorization: `Bearer ${token}` } };

      let clienteUserId = null;
      const typeUserEnum = vinculo === 'aluno' ? 'ALUNO' : vinculo === 'colaborador' ? 'FUNCIONARIO' : 'ESTRANGEIRO';
      const endpointCriar = vinculo === 'aluno' ? '/alunos' : vinculo === 'colaborador' ? '/funcionarios' : '/estrangeiros';
      const emailGerado = `${cpfNumeros}@cliente.unifor.br`;

      const dadosDoCliente = {
        user: {
          name: nome,
          cpf: cpfNumeros,
          phone: telefoneNumeros,
          birthDate: new Date(`${dataNascimento}T12:00:00Z`).toISOString(),
          email: emailGerado, 
          password: cpfNumeros, 
          typeUser: typeUserEnum
        },
        ...(vinculo === 'aluno' ? { aluno: { matricula } } : {}),
        ...(vinculo === 'colaborador' ? { funcionario: { matricula } } : {})
      };

      try {
        const respostaUsuario = await api.post(endpointCriar, dadosDoCliente, configHeaders);
        clienteUserId = respostaUsuario.data.userId || respostaUsuario.data.id;
      } catch (erroCriar) {
        const erroData = erroCriar.response?.data;
        const erroMensagem = JSON.stringify(erroData || '');
        
        if (
          erroMensagem.includes('Unique') || 
          erroMensagem.includes('Unique constraint') || 
          erroMensagem.includes('EmailAlreadyExists') ||
          erroData?.name === 'EmailAlreadyExists'
        ) {
          if (vinculo !== 'externo') {
            const rotaBusca = vinculo === 'aluno' ? '/alunos/matricula' : '/funcionarios/matricula';
            const respostaBusca = await api.get(`${rotaBusca}/${matricula}`, configHeaders);
            clienteUserId = respostaBusca.data.userId || respostaBusca.data.id;
          } else {
            const respostaLogin = await api.post('/auth/login', { email: emailGerado, password: cpfNumeros });
            clienteUserId = respostaLogin.data.userId;
          }
        } else {
          throw erroCriar; 
        }
      }

      if (!clienteUserId) throw new Error("Não foi possível obter o ID do cliente");

      const lugarEncontrado = espacosBanco.find(l => l.name === slotSelecionado?.local);
      
      if (!lugarEncontrado) {
        alert("Erro: Espaço não encontrado no banco de dados. Verifique a listagem de espaços.");
        setLoading(false);
        return;
      }

      const dataIsoString = new Date(`${dataSelecionada}T${slotSelecionado.horario}:00-03:00`).toISOString();

      await api.post('/schedulings', {
        userId: clienteUserId,
        placeId: lugarEncontrado.id, 
        date: dataIsoString,
        status: 'PENDING' 
      }, configHeaders);

      setSucesso(true);
    } catch (error) {
      console.error("Erro na integração:", error);
      alert("Houve um erro de servidor ao processar sua reserva. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const finalizarEFechar = () => {
    const precisaRecarregar = sucesso; 
    setNome(''); setCpf(''); setDataNascimento(''); setTelefone(''); 
    setVinculo('externo'); setMatricula(''); setErros({});
    setSucesso(false); setLoading(false);
    
    handleClose(); 
    
    if (precisaRecarregar) {
      window.location.reload(); 
    }
  };

  return (
    <Modal show={show} onHide={finalizarEFechar} size="lg" centered backdrop="static">
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={finalizarEFechar}></Modal.Header>
          <Modal.Body className="py-5">
            <div className="mb-4"><BiCheckCircle size={80} className="text-success" /></div>
            <h3 className="fw-bold text-body mb-3">Reserva Agendada!</h3>
            <p className="text-muted fs-5 mb-0">
              O espaço <strong>{complexoAtual} - {slotSelecionado?.local}</strong> foi reservado para <strong>{nome}</strong> às <strong>{slotSelecionado?.horario}</strong>. Ele aguarda confirmação.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="success" size="lg" className="px-5 fw-bold shadow-sm" onClick={finalizarEFechar}>Concluir</Button>
          </Modal.Footer>
        </div>
      ) : (
        <>
          <Modal.Header closeButton className="bg-primary text-white border-bottom-0">
            <Modal.Title className="fw-bold fs-5">Novo Agendamento</Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center bg-body-secondary p-3 rounded mb-4 border border-primary border-opacity-25">
              <div>
                <span className="text-muted small d-block">Espaço selecionado</span>
                <span className="fw-bold text-primary">{complexoAtual} - {slotSelecionado?.local}</span>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">Data e Hora</span>
                <span className="fw-bold text-body">
                  <BiCalendarAlt className="me-1 mb-1"/> 
                  {dataSelecionada?.split('-').reverse().join('/')} às {slotSelecionado?.horario}
                </span>
              </div>
            </div>

            <Form>
              <h6 className="fw-bold text-muted mb-3">Dados do Responsável</h6>
              
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Label className="fw-semibold small text-muted">Nome Completo *</Form.Label>
                  <div className="input-group">
                    <span className={`input-group-text bg-body ${erros.nome ? 'border-warning' : ''}`}><BiUser /></span>
                    <Form.Control type="text" placeholder="Nome completo" value={nome} onChange={(e) => { setNome(e.target.value); if(erros.nome) setErros({...erros, nome: null}); }} className={erros.nome ? 'border-warning shadow-none' : ''}/>
                  </div>
                  {erros.nome && <div className="text-warning small fw-bold mt-1"><BiErrorCircle /> {erros.nome}</div>}
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col md={4}>
                  <Form.Label className="fw-semibold small text-muted">CPF *</Form.Label>
                  <div className="input-group">
                    <span className={`input-group-text bg-body ${erros.cpf ? 'border-warning' : ''}`}><BiIdCard /></span>
                    <Form.Control type="text" placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} className={erros.cpf ? 'border-warning shadow-none' : ''}/>
                  </div>
                  {erros.cpf && <div className="text-warning small fw-bold mt-1"><BiErrorCircle /> {erros.cpf}</div>}
                </Col>

                <Col md={4}>
                  <Form.Label className="fw-semibold small text-muted">Nascimento *</Form.Label>
                  <Form.Control type="date" value={dataNascimento} max={new Date().toISOString().split('T')[0]} onChange={(e) => { setDataNascimento(e.target.value); if(erros.dataNascimento) setErros({...erros, dataNascimento: null}); }} className={erros.dataNascimento ? 'border-warning shadow-none' : ''}/>
                  {erros.dataNascimento && <div className="text-warning small fw-bold mt-1"><BiErrorCircle /> {erros.dataNascimento}</div>}
                </Col>

                <Col md={4}>
                  <Form.Label className="fw-semibold small text-muted">WhatsApp *</Form.Label>
                  <div className="input-group">
                    <span className={`input-group-text bg-body ${erros.telefone ? 'border-warning' : ''}`}><BiPhone /></span>
                    <Form.Control type="text" placeholder="(85) 90000-0000" value={telefone} onChange={handleTelefoneChange} className={erros.telefone ? 'border-warning shadow-none' : ''}/>
                  </div>
                  {erros.telefone && <div className="text-warning small fw-bold mt-1"><BiErrorCircle /> {erros.telefone}</div>}
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col md={4}>
                  <Form.Label className="fw-semibold small text-muted">Vínculo</Form.Label>
                  <Form.Select value={vinculo} onChange={(e) => { setVinculo(e.target.value); setErros({ ...erros, matricula: null }); }}>
                    <option value="externo">Público Externo</option>
                    <option value="aluno">Aluno / Ex-aluno</option>
                    <option value="colaborador">Colaborador</option>
                  </Form.Select>
                </Col>

                {vinculo !== 'externo' && (
                  <Col md={8}>
                    <Form.Label className="fw-bold small text-primary">Nº Matrícula *</Form.Label>
                    <Form.Control type="text" placeholder="Ex: 2410899" maxLength={7} value={matricula} onChange={handleMatriculaChange} className={erros.matricula ? 'border-warning shadow-none' : ''}/>
                  </Col>
                )}
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer className="bg-body-secondary border-top-0">
            <Button variant="outline-secondary" onClick={finalizarEFechar} disabled={loading}>Cancelar</Button>
            <Button variant="primary" onClick={handleSalvar} className="px-4 shadow-sm" disabled={loading}>
              {loading ? 'Processando...' : <><BiCheckCircle className="me-1"/> Agendar</>}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}