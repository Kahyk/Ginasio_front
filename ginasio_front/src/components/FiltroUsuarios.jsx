import { Form, InputGroup } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';

const FiltroUsuarios = ({ busca, setBusca, tipoFiltro, setTipoFiltro }) => {
  return (
    <div className="card-unifor p-3 mb-4 d-flex flex-row gap-3">
      <InputGroup className="flex-grow-1">
        <InputGroup.Text className="bg-transparent border-end-0 border-secondary-subtle">
          <BiSearch className="text-muted" />
        </InputGroup.Text>
        <Form.Control 
          className="bg-transparent border-start-0 border-secondary-subtle text-body" 
          placeholder="Buscar por nome, CPF ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)} 
        />
      </InputGroup>
      <Form.Select 
        style={{ width: '200px' }} 
        className="bg-transparent border-secondary-subtle text-body"
        value={tipoFiltro}
        onChange={(e) => setTipoFiltro(e.target.value)}
      >
        <option>Todos os Tipos</option>
        <option>Assessorias</option>
        <option>Locatários</option>
      </Form.Select>
    </div>
  );
};

export default FiltroUsuarios;