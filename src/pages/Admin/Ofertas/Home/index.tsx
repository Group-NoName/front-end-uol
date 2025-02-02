import { useCallback, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Nav_Admin from "../../../../components/Nav_Admin";
import Ioferta from "../../../../interfaces/oferta";
import LocationStateView from "../../../../interfaces/useLocationsState";
import { api } from "../../../../service/api";
import useStateView from "../../../../validators/useStateView";
import * as S from "./styles";

function Home() {
  const [ofertas, setOferta] = useState<Ioferta[]>([]);
  const [oferta, searchOferta] = useState<Ioferta[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState<Ioferta[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const stateView = new useStateView();
  const stateViewLocation = location.state as LocationStateView;

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const searchItems = (searchValue: any) => {
    setSearchInput(searchValue);
    const filteredData = oferta?.filter((item) => {
      return Object.values(String(item.preco)).join("").includes(searchInput);
    });
    setFilteredResults(filteredData);
  };

  const deleteOferta = useCallback(async (id: string) => {
    await api
      .delete(`/oferta/deletar/${id}`)
      .then(function (response) {
        if (response) {
          navigate(`/admin/ofertas`, {
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
          });
        }
      });
  }, []);

  useEffect(() => {
    api.get(`/oferta/ofertas`).then((response) => {
      searchOferta(response.data);
    });
  }, []);

  useEffect(() => {
    getOfertas();
  });
  async function getOfertas() {
    const response = await api.get<Ioferta[]>("/oferta/ofertas");
    setOferta(response.data);
  }
  return (
    <>
      <S.Home>
        <section>
          <header>
            <Nav_Admin />
          </header>
          <main>
            {stateView.validacao(
              stateViewLocation?.status,
              stateViewLocation?.data
            )}
            {stateView.validacao(status.type, status.mensagem)}
            <div className="Form">
              <Form.Control
                aria-label="Text input with dropdown button"
                onChange={(e) => searchItems(e.target.value)}
                placeholder="Buscar oferta"
              />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {searchInput.length > 1
                    ? filteredResults.map((item) => {
                        return (
                          <tr key={item?.id}>
                            <td>{item?.nome}</td>
                            <td>{item?.preco}</td>
                            <td className="tdbuttons">
                              <div className="buttons">
                                <Button
                                  variant="outline-success"
                                  onClick={() =>
                                    navigate(
                                      `/admin/ofertas/visualizar/${item.id}`
                                    )
                                  }
                                >
                                  Visualizar
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => deleteOferta(item.id)}
                                >
                                  Deletar
                                </Button>{" "}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    : oferta &&
                      oferta.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item?.nome}</td>
                            <td>{item?.preco}</td>
                            <td className="tdbuttons">
                              <div className="buttons">
                                <Button
                                  variant="outline-success"
                                  onClick={() =>
                                    navigate(
                                      `/admin/ofertas/visualizar/${item.id}`
                                    )
                                  }
                                >
                                  Visualizar
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => deleteOferta(item.id)}
                                >
                                  Deletar
                                </Button>{" "}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </Table>
            </div>
          </main>
        </section>
      </S.Home>
    </>
  );
}

export default Home;
