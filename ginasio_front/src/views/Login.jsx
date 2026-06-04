import { useState } from 'react';
import { Container, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { BiEnvelope, BiLockAlt, BiLogIn } from 'react-icons/bi';
import api from '../services/api'; // Importamos a nossa configuração da API

const Login = ({ setAutenticado, onOpenCadastroFuncionario }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      // Faz a requisição POST real para a rota /auth/login do back-end
      const response = await api.post('/auth/login', {
        email: email,
        password: senha
      });

      // Se o back-end responder com sucesso, ele nos devolve o Token JWT
      if (response.data && response.data.token) {
        // Guardamos o token com segurança no navegador para usar nas próximas telas
        localStorage.setItem('token', response.data.token);
        
        // Destranca o sistema!
        setAutenticado(true);
      } else {
        setErro('Falha na autenticação. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      
      const mensagemErro = error.response?.data?.error || 'Erro ao conectar com o servidor.';
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
      <div className="card-unifor p-5 shadow-sm border border-secondary-subtle" style={{ width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
        
        {/* Cabeçalho */}
        <div className="text-center mb-5">
          <h2 className="fw-bolder mb-1" style={{ color: 'var(--unifor-blue)', letterSpacing: '-0.5px' }}>
            UNIFOR
          </h2>
          <h6 className="text-muted fw-normal">Gestão Complexo Esportivo</h6>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <Alert variant="danger" className="small py-2 border-danger-subtle text-center">
            {erro}
          </Alert>
        )}

        {/* Formulário */}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label className="text-body fw-semibold small mb-1">E-mail</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-secondary-subtle">
                <BiEnvelope className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                type="email" 
                placeholder="Ex: admin@unifor.br" 
                className="bg-transparent border-start-0 border-secondary-subtle text-body shadow-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-body fw-semibold small mb-1">Senha</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-secondary-subtle">
                <BiLockAlt className="text-muted" />
              </InputGroup.Text>
              <Form.Control 
                type="password" 
                placeholder="Sua senha de acesso" 
                className="bg-transparent border-start-0 border-secondary-subtle text-body shadow-none"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 d-flex justify-content-center align-items-center gap-2 fw-bold" 
            style={{ backgroundColor: 'var(--unifor-blue)', border: 'none', padding: '12px', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : (
              <>
                Entrar no Sistema <BiLogIn size={20} />
              </>
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none fw-semibold"
            style={{ color: 'var(--unifor-blue)' }}
            onClick={onOpenCadastroFuncionario}
          >
            Cadastrar funcionário
          </button>
        </div>
        
        {/* Rodapé */}
        <div className="text-center mt-4 pt-3 border-top border-secondary-subtle">
          <p className="text-muted mb-0" style={{ fontSize: '11px', color: '#c26a0b' }}>
            Projeto de Extensão - Desenvolvimento Web
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login;