import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { BiBuildings, BiUser, BiSearch, BiCalendar, BiIdCard, BiEnvelope, BiPhone, BiError } from 'react-icons/bi';
import FiltroUsuarios from '../components/FiltroUsuarios';

const UsuariosView = () => {
  
  const [assessorias, setAssessorias] = useState([]); // Guarda a lista de assessorias vinda do banco
  const [locatarios, setLocatarios] = useState([]);   // Guarda a lista de locatários vinda do banco
  const [loading, setLoading] = useState(true);       // Controla se mostramos o ícone a girar (carregamento)
  const [erro, setErro] = useState(null);             // Guarda mensagens de erro se o servidor falhar

  // Estados dos Filtros (Barra de pesquisa e Dropdown)
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Todos os Tipos');

  //INTEGRAÇÃO COM O BACK-END
  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      try {
        setLoading(true);
        setErro(null);   

        // Dispara as duas requisições ao servidor ao mesmo tempo (Promise.all)
        const [respostaAssessorias, respostaLocatarios] = await Promise.all([
          fetch('http://localhost:8080/api/assessorias'),
          fetch('http://localhost:8080/api/locatarios')
        ]);

        // Se o servidor devolver um erro (ex: erro 500 ou servidor offline), paramos tudo
        if (!respostaAssessorias.ok || !respostaLocatarios.ok) {
          throw new Error('Falha ao buscar dados do servidor.');
        }

        // Convertemos a resposta do servidor para formato JSON (listas de JavaScript)
        const dadosAssessorias = await respostaAssessorias.json();
        const dadosLocatarios = await respostaLocatarios.json();

        // Guardamos os dados recebidos nos nossos estados
        setAssessorias(dadosAssessorias);
        setLocatarios(dadosLocatarios);
      } catch (error) {
          console.error("Erro na comunicação com a API:", error);
        setErro("Não foi possível conectar ao servidor. Verifique se o back-end está a correr.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoBanco();
  }, []); // Os colchetes vazios indicam que isto só roda uma vez, ao abrir a tela.

  //Calculam as quantidades com base no tamanho atual das listas
  const totalAssessorias = assessorias.length;
  const totalLocatarios = locatarios.length;
  const totalUsuarios = totalAssessorias + totalLocatarios;

  //Cria listas novas e filtradas de acordo com o que o utilizador digitou
  const assessoriasFiltradas = assessorias.filter(ass => {
    const nomeBusca = ass.nome ? ass.nome.toLowerCase() : '';
    const cnpjBusca = ass.cnpj ? String(ass.cnpj) : '';
    const emailBusca = ass.email ? ass.email.toLowerCase() : '';

    //Verifica se a pesquisa bate com o nome, CNPJ ou email
    const matchBusca = nomeBusca.includes(busca.toLowerCase()) || 
                       cnpjBusca.includes(busca) || 
                       emailBusca.includes(busca.toLowerCase());
    
    // Verifica se o dropdown permite mostrar assessorias
    const matchTipo = tipoFiltro === 'Todos os Tipos' || tipoFiltro === 'Assessorias';
    
    return matchBusca && matchTipo;
  });

  const locatariosFiltrados = locatarios.filter(loc => {
    const nomeBusca = loc.nome ? loc.nome.toLowerCase() : '';
    const cpfBusca = loc.cpf ? String(loc.cpf) : '';
    const emailBusca = loc.email ? loc.email.toLowerCase() : '';

    const matchBusca = nomeBusca.includes(busca.toLowerCase()) || 
                       cpfBusca.includes(busca) || 
                       emailBusca.includes(busca.toLowerCase());
                       
    const matchTipo = tipoFiltro === 'Todos os Tipos' || tipoFiltro === 'Locatários';
    
    return matchBusca && matchTipo;
  });

  //O que o utilizador realmente vê no ecrã
  return (
    <div className="h-100">
      {/* Cabeçalho */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-body">Gestão de Usuários</h3>
        <p className="text-muted small mb-0">Visualize e gerencie assessorias e locatários cadastrados</p>
      </div>

      {/* Alerta de Erro do Back-end */}
      {erro && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <BiError size={24} /> {erro}
        </Alert>
      )}

      {/* Cards Superiores com os Contadores */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-primary mb-0">{loading ? '-' : totalUsuarios}</h2>
            <p className="text-muted small mb-0">Total de Usuários</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-unifor-purple mb-0">{loading ? '-' : totalAssessorias}</h2>
            <p className="text-muted small mb-0">Assessorias</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card-unifor p-3 text-center">
            <h2 className="fw-bold text-success mb-0">{loading ? '-' : totalLocatarios}</h2>
            <p className="text-muted small mb-0">Locatários</p>
          </div>
        </Col>
      </Row>

      {/* Barra de Pesquisa */}
      <FiltroUsuarios busca={busca} setBusca={setBusca} tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro} />

      {/* Spinner de Carregamento (Enquanto o back-end responde) */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Buscando dados no servidor...</p>
        </div>
      )}

      {/* Listagem (Só renderiza se não estiver a carregar e se não houver erro no servidor) */}
      {!loading && !erro && (
        <>
          {/* BLOCO: ASSESSORIAS ESPORTIVAS */}
          {(tipoFiltro === 'Todos os Tipos' || tipoFiltro === 'Assessorias') && (
            <div className="mb-5">
              <h6 className="fw-bold text-body d-flex align-items-center gap-2 mb-3">
                <BiBuildings className="text-unifor-purple" /> Assessorias Esportivas ({assessoriasFiltradas.length})
              </h6>
              
              {/* Se a lista estiver vazia (Marco Zero) */}
              {assessoriasFiltradas.length === 0 ? (
                <div className="bg-unifor-purple-subtle rounded p-4 text-center border border-unifor-purple">
                  <h6 className="fw-bold text-unifor-purple mb-0">
                    Nenhuma assessoria cadastrada no momento.
                  </h6>
                </div>
              ) : (
                /* Se tiver dados, desenha os cards através do .map() */
                <Row className="g-3">
                  {assessoriasFiltradas.map(ass => (
                    <Col xs={12} key={ass.id}>
                      <div className="card-unifor p-4">
                        <div className="d-flex align-items-start gap-3 mb-3">
                          <div className="bg-unifor-purple-subtle rounded p-2">
                            <BiBuildings size={24} className="text-unifor-purple" />
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1 text-body">{ass.nome}</h6>
                            <span className="badge bg-unifor-purple-subtle border border-unifor-purple text-unifor-purple">
                              {ass.tipo || 'Assessoria - Horários Fixos'}
                            </span>
                          </div>
                        </div>
                        <Row className="text-muted small my-4">
                          <Col md={4}><div className="d-flex align-items-center gap-1 mb-1"><BiIdCard size={18}/> CNPJ</div><div className="text-body fw-medium">{ass.cnpj}</div></Col>
                          <Col md={4}><div className="d-flex align-items-center gap-1 mb-1"><BiEnvelope size={18}/> E-mail</div><div className="text-body fw-medium">{ass.email}</div></Col>
                          <Col md={4}><div className="d-flex align-items-center gap-1 mb-1"><BiPhone size={18}/> Telefone</div><div className="text-body fw-medium">{ass.telefone}</div></Col>
                        </Row>
                        <div className="border-top border-secondary-subtle pt-3 mt-3 d-flex justify-content-between align-items-center text-muted small">
                          <div className="d-flex align-items-center gap-2"><BiCalendar size={18} /><span>Contrato desde {ass.contratoDesde || 'Data não informada'}</span></div>
                          <span className="badge bg-body-secondary text-body border border-secondary-subtle rounded-pill">{ass.reservasAtivas || 0} reserva{(ass.reservasAtivas !== 1) ? 's' : ''} ativa{(ass.reservasAtivas !== 1) ? 's' : ''}</span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}

          {/* BLOCO: LOCATÁRIOS AVULSOS */}
          {(tipoFiltro === 'Todos os Tipos' || tipoFiltro === 'Locatários') && (
            <div className="mb-4">
              <h6 className="fw-bold text-body d-flex align-items-center gap-2 mb-3">
                <BiUser className="text-success" /> Locatários Avulsos ({locatariosFiltrados.length})
              </h6>

              {/* Se a lista estiver vazia (Marco Zero) */}
              {locatariosFiltrados.length === 0 ? (
                <div className="bg-success-subtle rounded p-4 text-center border border-success-subtle">
                  <h6 className="fw-bold text-success mb-0">
                    Nenhum utilizador cadastrado no momento.
                  </h6>
                </div>
              ) : (
                /* Se tiver dados, desenha os cards através do .map() */
                <Row className="g-3">
                  {locatariosFiltrados.map(loc => (
                    <Col md={6} key={loc.id}>
                      <div className="card-unifor p-4 h-100 d-flex flex-column">
                        <div className="d-flex align-items-start gap-3 mb-4">
                          <div className="bg-success-subtle text-success rounded p-2">
                            <BiUser size={24} />
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1 text-body">{loc.nome}</h6>
                            {loc.matricula && (
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                Matrícula: {loc.matricula}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-muted small mb-4 d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2"><BiIdCard size={18} /> CPF: {loc.cpf}</div>
                          <div className="d-flex align-items-center gap-2"><BiEnvelope size={18} /> {loc.email}</div>
                          <div className="d-flex align-items-center gap-2"><BiPhone size={18} /> {loc.telefone}</div>
                        </div>
                        <div className="border-top border-secondary-subtle pt-3 mt-auto">
                          <span className="badge bg-body-secondary text-body border border-secondary-subtle rounded-pill">
                            {loc.reservas || 0} reserva{(loc.reservas !== 1) ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </>
      )}

      {/* 7. RODAPÉ ESTÁTICO: Informações de apoio e legenda */}
      <div className="rounded p-4 mt-4 bg-body-secondary border border-secondary-subtle">
        <h6 className="fw-bold mb-3 text-body">Tipos de Usuários</h6>
        <p className="fw-bold text-body mb-1 small">Assessorias (Fixas):</p>
        <p className="text-muted mb-3 small">Possuem contrato e horários pré-definidos. Reservas recorrentes no sistema.</p>
        <p className="fw-bold text-body mb-1 small">Locatários (Avulsos):</p>
        <p className="text-muted mb-0 small">Devem preencher Termo de Responsabilidade antes de utilizar os espaços. Requerem confirmação de pagamento para validação da reserva.</p>
      </div>
    </div>
  );
};

export default UsuariosView;