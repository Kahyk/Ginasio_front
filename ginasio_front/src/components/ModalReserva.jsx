import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BiCheckCircle } from 'react-icons/bi';
import api from '../services/api';

const ModalReserva = ({ show, handleClose, dataSelecionada, complexoAtual, slotSelecionado }) => {
const [validated, setValidated] = useState(false);
const [sucesso, setSucesso] = useState(false);
const [espacosBanco, setEspacosBanco] = useState([]); 
const [placeId, setPlaceId] = useState('');
const [data, setData] = useState('');
const [horarioInicio, setHorarioInicio] = useState('');
const [reservationPerson, setReservationPerson] = useState({
    name: '',
    email: '',
    cpf: '',
    typeUser: 'ALUNO',
    matricula: ''
  });

  
  useEffect(() => {
    if (show) {
      const fetchPlaces = async () => {
        try {
          const res = await api.get('/places');
          if (res.status === 200) {
            const lugares = res.data;
            setEspacosBanco(lugares);
            
            
            if (slotSelecionado) {
               const lugarEncontrado = lugares.find(l => l.name === slotSelecionado.local);
               if(lugarEncontrado) setPlaceId(lugarEncontrado.id);
            }
          }
        } catch (err) { console.error(err); }
      };
      fetchPlaces();
      
      setData(dataSelecionada || '');
      setHorarioInicio(slotSelecionado?.horario || '');
      setReservationPerson({
        name: '',
        email: '',
        cpf: '',
        typeUser: 'ALUNO',
        matricula: ''
      });
    }
  }, [show, slotSelecionado, dataSelecionada]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const dataFormatada = new Date(`${data}T${horarioInicio}`).toISOString();
      const response = await api.post('/schedulings', {
        placeId: placeId,
        date: dataFormatada,
        status: 'PENDING',
        reservationName: reservationPerson.name,
        reservationEmail: reservationPerson.email,
        reservationCpf: reservationPerson.cpf,
        reservationTypeUser: reservationPerson.typeUser,
        reservationMatricula: reservationPerson.typeUser === 'ALUNO' ? reservationPerson.matricula : null
      });

      if (response.status === 201) {
        setSucesso(true);
      }
    } catch (error) {
      console.error("Erro ao criar reserva", error);
    }
  };

  const fecharELimpar = () => {
    setValidated(false);
    setSucesso(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={fecharELimpar} size="lg" centered backdrop="static" scrollable>
      {sucesso ? (
        <div className="p-4 text-center">
          <Modal.Header closeButton className="border-0 p-0" onHide={fecharELimpar}></Modal.Header>
          <Modal.Body className="py-5">
            <BiCheckCircle size={80} className="text-success mb-3" />
            <h3 className="fw-bold text-body mb-3">Reserva Criada com Sucesso!</h3>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button variant="dark" size="lg" className="px-5 fw-bold shadow-sm" onClick={fecharELimpar}>Concluir</Button>
          </Modal.Footer>
        </div>
      ) : (
        <>
          <Modal.Header closeButton className="border-bottom-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Reserva via Calendário - {complexoAtual}</Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4 pt-2">
            <Form id="form-reserva-calendario" noValidate validated={validated} onSubmit={handleSubmit}>
              
              <h6 className="fw-bold mb-3 text-body">Dados da Reserva</h6>
              <Row className="g-3 mb-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Espaço *</Form.Label>
                    <Form.Select 
                      required 
                      className="bg-body-tertiary fw-semibold text-primary border-primary border-opacity-50 shadow-sm"
                      value={placeId}
                      onChange={(e) => setPlaceId(e.target.value)}
                    >
                      <option value="">Selecione um espaço</option>
                      {espacosBanco.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Selecione um espaço na lista.</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Data *</Form.Label>
                    <Form.Control type="date" required className="bg-body-tertiary text-muted" value={data} onChange={(e) => setData(e.target.value)}/>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Horário Início *</Form.Label>
                    <Form.Control type="time" required className="bg-body-tertiary text-muted" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)}/>
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="fw-bold mb-3 text-body">Dados da Pessoa da Reserva</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Nome *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Nome completo"
                      className="bg-body-tertiary text-muted"
                      value={reservationPerson.name}
                      onChange={(e) => setReservationPerson((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="email@exemplo.com"
                      className="bg-body-tertiary text-muted"
                      value={reservationPerson.email}
                      onChange={(e) => setReservationPerson((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">CPF *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      className="bg-body-tertiary text-muted"
                      value={reservationPerson.cpf}
                      onChange={(e) => setReservationPerson((prev) => ({ ...prev, cpf: e.target.value }))}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Tipo *</Form.Label>
                    <Form.Select
                      required
                      className="bg-body-tertiary text-muted"
                      value={reservationPerson.typeUser}
                      onChange={(e) => setReservationPerson((prev) => ({
                        ...prev,
                        typeUser: e.target.value,
                        matricula: e.target.value === 'ALUNO' ? prev.matricula : ''
                      }))}
                    >
                      <option value="ALUNO">Aluno</option>
                      <option value="FUNCIONARIO">Funcionário</option>
                      <option value="ESTRANGEIRO">Estrangeiro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-body mb-1">Matrícula {reservationPerson.typeUser === 'ALUNO' ? '*' : '(opcional)'}</Form.Label>
                    <Form.Control
                      type="text"
                      required={reservationPerson.typeUser === 'ALUNO'}
                      disabled={reservationPerson.typeUser !== 'ALUNO'}
                      placeholder="Matrícula do aluno"
                      className="bg-body-tertiary text-muted"
                      value={reservationPerson.matricula}
                      onChange={(e) => setReservationPerson((prev) => ({ ...prev, matricula: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer className="bg-body border-top-0 pt-0 pb-4 px-4">
            <Button variant="outline-secondary" onClick={fecharELimpar} className="px-4">Cancelar</Button>
            <Button variant="dark" type="submit" form="form-reserva-calendario" className="px-4 shadow-sm">Criar Reserva</Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ModalReserva;
