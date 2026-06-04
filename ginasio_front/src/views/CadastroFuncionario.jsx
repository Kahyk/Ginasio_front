import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { BiUserPlus, BiArrowBack, BiBadgeCheck, BiEnvelope, BiLockAlt, BiIdCard, BiPhone } from 'react-icons/bi';
import api from '../services/api';

const CadastroFuncionario = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    birthDate: '',
    phone: '',
    matricula: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const atualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await api.post('/funcionarios', {
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf,
          birthDate: new Date(formData.birthDate).toISOString(),
          phone: formData.phone
        },
        funcionario: {
          matricula: formData.matricula
        }
      });

      setSucesso(true);
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      setErro(error.response?.data?.error || 'Não foi possível cadastrar o funcionário.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="card-unifor p-5 shadow-sm border border-secondary-subtle text-center" style={{ width: '100%', maxWidth: '520px', borderRadius: '12px' }}>
          <div className="mb-4">
            <BiBadgeCheck size={64} className="text-success mb-3" />
            <h3 className="fw-bold text-body mb-2">Funcionário cadastrado</h3>
            <p className="text-muted mb-0">O cadastro foi concluído com sucesso. Agora você pode acessar o sistema.</p>
          </div>

          <Button
            variant="dark"
            className="px-4"
            onClick={onBackToLogin}
          >
            Voltar para o login
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary py-5">
      <div className="card-unifor p-4 p-md-5 shadow-sm border border-secondary-subtle w-100" style={{ maxWidth: '920px', borderRadius: '12px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bolder mb-1" style={{ color: 'var(--unifor-blue)', letterSpacing: '-0.5px' }}>
              Cadastro de Funcionário
            </h2>
            <p className="text-muted mb-0">Preencha os dados para liberar o acesso ao sistema</p>
          </div>

          <Button variant="outline-secondary" onClick={onBackToLogin} className="d-flex align-items-center gap-2">
            <BiArrowBack size={18} /> Voltar
          </Button>
        </div>

        {erro && (
          <Alert variant="danger" className="mb-4">
            {erro}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Nome completo</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => atualizarCampo('name', e.target.value)}
                  placeholder="Nome do funcionário"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">E-mail</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => atualizarCampo('email', e.target.value)}
                  placeholder="funcionario@unifor.br"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Senha</Form.Label>
                <Form.Control
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => atualizarCampo('password', e.target.value)}
                  placeholder="Crie uma senha de acesso"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">CPF</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => atualizarCampo('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Data de nascimento</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => atualizarCampo('birthDate', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Telefone</Form.Label>
                <Form.Control
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => atualizarCampo('phone', e.target.value)}
                  placeholder="(85) 99999-9999"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.matricula}
                  onChange={(e) => atualizarCampo('matricula', e.target.value)}
                  placeholder="Matrícula do funcionário"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" type="button" onClick={onBackToLogin}>
              Cancelar
            </Button>
            <Button type="submit" className="d-flex align-items-center gap-2 fw-bold" style={{ backgroundColor: 'var(--unifor-blue)', border: 'none' }} disabled={loading}>
              <BiUserPlus size={18} /> {loading ? 'Cadastrando...' : 'Cadastrar funcionário'}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CadastroFuncionario;