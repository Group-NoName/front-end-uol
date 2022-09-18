import { AxiosError } from 'axios';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import CardProds from '../../components/CardProds';
import Nav_ from '../../components/Nav';
import Iproduto from '../../interfaces/produto';
import { api } from '../../service/api';
import * as S from './styles';

function Produto() {

  const { id } = useParams();

  const [produto, setProduto] = useState<Iproduto>()

  const [produtos, setProdutos] = useState<Iproduto[]>([])

  const [produtosTag, setProdutosTag] = useState<Iproduto[]>([])

  const navigate = useNavigate();

  useEffect(() => { getProduto(), getProdutosSemelhantes() }, [id]);

  async function getProduto() {
    const response = await api.get<Iproduto>(`/produto/produtos/${id}`)
    setProduto(response.data)
  }


  useEffect(() => { getAllProdutos() })
  async function getAllProdutos() {
    const response = await api.get<Iproduto[]>('/produto/produtos')
    setProdutos(response.data)
  }

  async function getProdutosSemelhantes() {
    const response = await api.get<Iproduto[]>(`/produto/produtos-semelhantes/${id}`)
    setProdutosTag(response.data)
  }

  function viewProduto(id: string) {
    navigate(`produto/${id}`)
  }


  return (
    <>
      <Nav_ />
      <S.Container>
        <div className='produtoContent'>
          <div className='imgLateral'>
            {produto?.images.map(i => {
              return (
                <>
                  <div className="imgsLateral">
                    <div className="imgs">
                      <img className='tamanho' src={`${i.url}`} alt="" />
                    </div>
                  </div>
                </>)
            })}
          </div>
          <div className='imgCentral'>
            <div className="posicao">
              <img className='tamanho' src={produto?.images[0].url} alt="" />
            </div>
          </div>
          <div className='produtoInformation'>
            <div className='produtoDescricao'>
              <div className="nome">
                <h1>{produto?.nome}</h1>  
              </div>
              <div className="desc">
                <p>{produto?.descricao}</p>
              </div>
              <div className='produtoPrice'>
                <div className='price'>
                  <h2>R$ {produto?.preco}</h2>
                </div>
                <div className='produtopricebuttom'>
                  <Button color={'#ffff'} width={'8'} height={'3'} fontSize={'20'} backgroundColor={'#3a4ad9'} text={'Comprar'} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='produtosLists'>
          <div className='produtosAdicionais'>
            {produtosTag && produtosTag.map(i => {
              return (
                <>
                <div className="cards">
                  <h1>{i.nome} + {i.tags.length}</h1>
                  <CardProds imageURL={`${i.images[0].url}`} name={`${i.nome}`} produtoID={`${i.id}`} preco={i.preco} />
                </div>
                </>
              )
            })}
          </div>
          <h2>Produtos Relacionados</h2>
          <div className='produtosRelacionados'>
            <div className='posicao'>
              {produtos && produtos.map(i => {
                return (
                  <CardProds imageURL={`${i.images[0].url}`} name={`${i.nome}`} produtoID={`${i.id}`} preco={i.preco} />
                )
              })}
            </div>
          </div>
        </div>
      </S.Container>
    </>
  )
}

export default Produto;