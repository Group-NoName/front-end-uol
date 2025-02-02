import * as S from "./styles";
import { useState, useEffect, useCallback } from "react";
import Nav_Admin from "../../../../components/Nav_Admin";
import Iproduto from "../../../../interfaces/produto";
import Categoria from "../../../../interfaces/categoria";
import { api } from "../../../../service/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import useStateView from "../../../../validators/useStateView";
import LocationStateView from "../../../../interfaces/useLocationsState";
import { AiOutlineArrowLeft } from "react-icons/ai";

function visualizar() {
  const [categoria, setCategoria] = useState<Categoria>();
  const [categoriasProdutos, setCategoriaProdutos] = useState<Iproduto[]>([]);
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateView = new useStateView();
  const stateViewLocation = location.state as LocationStateView;

  useEffect(() => {
    getCategorias(), getCategoriasProdutos();
  }, [id]);

  async function getCategorias() {
    const response = await api.get<Categoria>(`/servico/servicos/${id}`);
    setCategoria(response.data);
  }

  async function getCategoriasProdutos() {
    const response = await api.get<Iproduto[]>(
      `servico/servicos/${id}/produtos`
    );
    setCategoriaProdutos(response.data);
  }

  const deletarRelacao = useCallback(async (idCat: string, idProd: string) => {
    await api
      .put(`servico/deletar-produto/${idCat}`, {
        produtos: [
          {
            id: `${idProd}`,
          },
        ],
      })
      .then(function (response) {
        if (response) {
          navigate(`/admin/categorias/visualizar/${id}`, {
            state: {
              data: response.data,
              status: response.status,
            },
          }),
            navigate(0);
        }
      })
      .catch(function (error) {
        if (error.response) {
          setStatus({
            type: "error",
            mensagem: `${error.response.data}`,
          }),
            navigate(0);
        }
      });
  }, []);

  const deletarCategoria = useCallback(async (id: string) => {
    await api
      .delete(`/servico/deletar/${id}`)
      .then(function (response) {
        if (response) {
          navigate(`/admin/categorias`, {
            state: {
              data: response.data,
              status: response.status,
            },
          }),
            navigate(0);
        }
      })
      .catch(function (error) {
        if (error.response) {
          setStatus({
            type: "error",
            mensagem: `${error.response.data}`,
          }),
            navigate(0);
        }
      });
  }, []);

  return (
    <>
      <S.Visualizar>
        <section>
          <header>
            <Nav_Admin />
          </header>
          <main>
            {stateView.validacao(status.type, status.type)}
            {stateView.validacao(
              stateViewLocation?.status,
              stateViewLocation?.data
            )}
            <div className="categoria">
              <AiOutlineArrowLeft
                className="icon"
                onClick={() => navigate(-1)}
              />
              <div className="left-content">
                <div className="content">
                  <h1>Serviço: {categoria?.nome}</h1>
                  <div className="bottons">
                    <Link to={`/admin/categorias/editar/${categoria?.id}`}>
                      <Button variant="success">Editar</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => deletarCategoria(String(categoria?.id))}
                    >
                      Deletar
                    </Button>
                  </div>     
                </div>
              </div>
            </div>
            <div className="produtosRelacionados">
              <h3>Produtos</h3>
              <div className="produtos">
                {categoria?.produtos.map((item) => {
                  if (item == null) {
                    return <h1></h1>;
                  } else {
                    return (
                      <div className="produto" key={item.id}>
                        <p>{item?.nome}</p>
                        <div className="buttons">
                          <Button
                            variant="danger"
                            onClick={() =>
                              deletarRelacao(
                                String(categoria?.id),
                                String(item?.id)
                              )
                            }
                          >
                            Deletar
                          </Button>
                          <Link to={`/admin/produtos/visualizar/${item?.id}`}>
                            <Button variant="primary">Visualizar</Button>
                          </Link>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </main>
        </section>
      </S.Visualizar>
    </>
  );
}
export default visualizar;
