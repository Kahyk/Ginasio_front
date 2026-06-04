import { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { BiUser, BiIdCard, BiEnvelope, BiPhone, BiError } from 'react-icons/bi';
import FiltroUsuarios from '../components/FiltroUsuarios';
import api from '../services/api';

const UsuariosView = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Todos os Tipos');

  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      try {
        setLoading(true);
        setErro(null);

        const resposta = await api.get('/funcionarios');
        setFuncionarios(resposta.data);
      } catch (error) {
        console.error('Erro na comunicação com a API:', error);
        setErro('Não foi possível conectar ao servidor. Verifique se o back-end está a correr.');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoBanco();
  }, []);

  const funcionariosFiltrados = funcionarios.filter((funcionario) => {
    const nomeBusca = funcionario.user?.name ? funcionario.user.name.toLowerCase() : '';
    const cpfBusca = funcionario.user?.cpf ? String(funcionario.user.cpf) : '';
    const emailBusca = funcionario.user?.email ? funcionario.user.email.toLowerCase() : '';
    const matriculaBusca = funcionario.matricula ? String(funcionario.matricula).toLowerCase() : '';

    const matchBusca =
      nomeBusca.includes(busca.toLowerCase()) ||
      cpfBusca.includes(busca) ||
      emailBusca.includes(busca.toLowerCase()) ||
      matriculaBusca.includes(busca.toLowerCase());

    const matchTipo = tipoFiltro === 'Todos os Tipos' || tipoFiltro === 'Funcionários';

    return matchBusca && matchTipo;
  });

  return (
    <div className="h-100">
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-body">Gestão de Usuários</h3>
        <p className="text-muted small mb-0">Lista de funcionários cadastrados no sistema</p>
      </div>

      {erro && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <BiError size={24} /> {erro}
        </Alert>
      )}

      <Row className="mb-4 g-3">
        <Col md={12}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-primary mb-0">{loading ? '-' : funcionarios.length}</h2>
            <p className="text-muted small mb-0">Total de Funcionários</p>
          </div>
        </Col>
      </Row>

      <FiltroUsuarios
        busca={busca}
        setBusca={setBusca}
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
      />

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Buscando dados no servidor...</p>
        </div>
      )}

      {!loading && !erro && (
        <div className="mb-4">
          <h6 className="fw-bold text-body d-flex align-items-center gap-2 mb-3">
            <BiUser className="text-success" /> Funcionários ({funcionariosFiltrados.length})
          </h6>

          {funcionariosFiltrados.length === 0 ? (
            <div className="bg-success-subtle rounded p-4 text-center border border-success-subtle">
              <h6 className="fw-bold text-success mb-0">Nenhum funcionário cadastrado no momento.</h6>
            </div>
          ) : (
            <Row className="g-3">
              {funcionariosFiltrados.map((funcionario) => (
                <Col md={6} key={funcionario.id}>
                  <div className="card-unifor p-4 h-100 d-flex flex-column">
                    <div className="d-flex align-items-start gap-3 mb-4">
                      <div className="bg-success-subtle text-success rounded p-2">
                        <BiUser size={24} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-body">{funcionario.user?.name}</h6>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          Matrícula: {funcionario.matricula}
                        </span>
                      </div>
                    </div>

                    <div className="text-muted small mb-4 d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2"><BiIdCard size={18} /> CPF: {funcionario.user?.cpf}</div>
                      <div className="d-flex align-items-center gap-2"><BiEnvelope size={18} /> {funcionario.user?.email}</div>
                      <div className="d-flex align-items-center gap-2"><BiPhone size={18} /> {funcionario.user?.phone}</div>
                    </div>

                    <div className="border-top border-secondary-subtle pt-3 mt-auto">
                      <span className="badge bg-body-secondary text-body border border-secondary-subtle rounded-pill">
                        {funcionario.user?.typeUser || 'FUNCIONARIO'}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      <div className="rounded p-4 mt-4 bg-body-secondary border border-secondary-subtle">
        <h6 className="fw-bold mb-3 text-body">Estrutura Atual</h6>
        <p className="text-muted mb-0 small">
          Os cadastros de aluno e estrangeiro foram removidos. O sistema mantém usuários e funcionários,
          enquanto os dados do locatário passam a ser gravados diretamente na reserva.
        </p>
      </div>
    </div>
  );
};

export default UsuariosView;