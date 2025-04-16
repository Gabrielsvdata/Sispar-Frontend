import styles from "./Solicitacao.module.scss";
import { useEffect, useState } from "react"; 
import Api from "../../Services/Api";

import NavBar from "../navbar/NavBar";
import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";
import Deletar from "../../assets/solicitacao/deletar.png";
import Lixeira from "../../assets/solicitacao/lixeira.png";
import Calendario from "../../assets/solicitacao/calendario.png"
import setaBaixo from "../../assets/solicitacao/seta baixa.png"
import IconeX from "../../assets/solicitacao/x.png"
import Motivo from "../../assets/solicitacao/motivo.png"
import IconeMais from "../../assets/solicitacao/+.png"
import Check from "../../assets/solicitacao/check.png"

function Solicitacao() {

  const [colaborador, setColaborador] = useState(""); // Estado para o campo colaborador
  const [empresa, setEmpresa] = useState(""); // Estado para o campo empresa
  const [nPrestacao, setnPrestacao] = useState(""); // Estado para o campo número de prestação
  const [descricao, setDescricao] = useState(""); // Estado para o campo  descrição
  const [data, setData] = useState(""); // Estado para o campo data
  const [motivo, setMotivo] = useState(""); // Estado para o campo motivo  //ESSE ESTADO É PARA QUEM TÁ FAZENDO AVANÇADO UTILIZANDO MODAL
  const [tipoReembolso, setTipoReembolso] = useState(""); // Estado para o campo tipo de reembolso
  const [centroCusto, setCentroCusto] = useState(""); // Estado para o campo centro de custo
  const [ordemInterna, setorOrdemInterna] = useState(""); // Estado para o campo ordem interna
  const [divisao, setDivisao] = useState(""); // Estado para o campo divisão
  const [pep, setPep] = useState(""); // Estado para o campo pep
  const [moeda, setMoeda] = useState(""); // Estado para o campo moeda
  const [distanciaKm, setDistanciaKm] = useState(""); // Estado para o campo distância km
  const [valorKm, setValorKm] = useState(""); // Estado para o campo valor km
  const [valorFaturado, setValorFaturado] = useState(""); // Estado para o campo valor faturado
  const [despesa, setDespesa] = useState(""); // Estado para o campo despesa

  const[dadosReembolso, setDadosReembolso] = useState([]);

  //FUNÇÃO PARA CAPTURAR OS VALORES DOS ESTADOS 

  const handleSubmit = () => {
    
    const objetoReembolso = {
      colaborador,
      empresa,
      nPrestacao,
      descricao,
      data,
      tipoReembolso,
      ordemInterna,
      centroCusto,
      divisao,
      pep,
      moeda,
      distanciaKm,
      valorKm,
      valorFaturado,
      despesa
    };
    setDadosReembolso( dadosReembolso.concat(objetoReembolso));
    limparCampos();
  };
 //limpar campos dos inputs 
  const limparCampos = () => {
    setColaborador(""),
    setEmpresa(""),
    setnPrestacao(""),
    setDescricao(""),
    setData(""),
    setMotivo(""),
    setTipoReembolso(""),
    setCentroCusto(""),
    setorOrdemInterna(""),
    setDivisao(""),
    setPep(""),
    setMoeda(""),
    setDistanciaKm(""),
    setValorKm(""),
    setValorFaturado(""),
    setDespesa("");
  };

  // FUNÇÃO PARA ENIVAR DADOS PARA API
  const [ foiEnviado, setFoiEnviado ] = useState (false); // Serve para saber se o formulário foi envIADO

  // FUNCAÇÃO ASYNC(assincrona) permite que o codigo espere algo(resposta do servidor) sem travar o programa
  const enviarParaAnalise = async () => {
    try{
      //colocamos o que queremos tentar fazer

      // primeiro argumento é o caminhod a rota "/refunds/new" é uma rota do backend
      // segundo argumento é o que sera enviado: dadosReembolso

      const response = await Api.post("refunds/new", dadosReembolso);
      console.log("Resposta da API", response) //MOstra no console a resposta da
      alert("reembolso solicitado com sucesso")
      setFoiEnviado(true); //ativando o estado "foiEnviado" para true 
    } catch(error){
    //caso de erro na hora de enviar, ele mostra o erro no console.log
    console.log("Erro ao enviar", error) // MOstra erro se algo der errado
    }
  };

  //Hook USEEFFECT, serve para reagir a mudança nos estados

  useEffect(() => {
    if(foiEnviado){
      setDadosReembolso([]); //Limpa os dados do formulário, ou seja, zera o estado
        setFoiEnviado(false);
    }

  }, [foiEnviado]);

  return (
    <div className={styles.layoutSolicitacao}>
      <NavBar />
      
      <div className={styles.containerPrincipalSolicitacao}>
      <main className={styles.mainSolicitacao}>
        <header className={styles.headerSolicitacao}>
          <img src={Home} alt="Botão de home" />
          <img src={Seta} alt="Seta indicativa do home" />
          <p>Reembolsos</p>
          <img src={Seta} alt="" />
          <p>Solicitação de Reembolso</p>
        </header>

          <form  onSubmit={(e) => e.preventDefault() } className={styles.formSolicitacao}>

            <div className={styles.grupo1}>
              <div className={styles.inputNome}>
                <label htmlFor="">Nome Completo</label>
                <input type="text" name="colaborador" value={colaborador} onChange={(e) => setColaborador(e.target.value)}/>
              </div>

              <div className={styles.inputEmpresa}>
                <label htmlFor="">Empresa</label>
                <input type="text" name="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value) }/>
              </div>

              <div className={styles.inputPrestacao}>
                <label htmlFor="">Nº Prest. Contas</label>
                <input type="text" name="numPrestação" value={nPrestacao} onChange={(e) => setnPrestacao(e.target.value)} />
              </div>

              <div className={styles.inputMotivo}>
                <label htmlFor=""> Descrição / Motivo do Reembolso </label>
                <textarea name="" id="">
                  {" "}
                </textarea>
              </div>
            </div>

            <div className={styles.barraVertical}></div>
            <div className={styles.grupo2}>

              <div className={styles.inputData}>
                <label htmlFor="">Data</label>
                <img className={styles.imgData}src={Calendario} alt="" />
                <input type="date" name="" id="" value={data} onChange={(e) => setData(e.target.value)}/>
              </div>

              <div className={styles.tipoDeDespesa}>
                <label htmlFor=""> Tipo de Despesa </label>   
                <img className={styles.imgDespesa} src={setaBaixo} alt="" />          

                <select name="" id="">
                  <option value=""> Selecionar</option>
                  <option value="">Alimentação</option>
                  <option value="">Combustível</option>
                  <option value="">Condução</option>
                  <option value="">Estacionamento</option>
                  <option value="">Viagem Administrativa</option>
                  <option value="">Viagem Operacional</option>
                  <option value="">Eventos de representação</option>
                </select>
              </div>

              <div className={styles.centroDeCusto}>
                <label htmlFor="">Centro de Custo</label>
                <img className={styles.imgCustos}src={setaBaixo} alt="" />
                <select name="" id="">
                  <option value="">
                    1100109002 - FIM CONTROLES INTERNOS MTZ
                  </option>
                  <option value="">
                    1100110002 - FIN VICE-PRESIDENCIA FINANCAS MTZ
                  </option>
                  <option value="">1100110101 - FIN CONTABILIDADE MTZ</option>
                </select>
                
              </div>

              <div className={styles.ordem}>
                <label htmlFor="">Ord. Int.</label>
                <input type="number" name="" id="" value={ordemInterna} onChange={(e) => setorOrdemInterna(e.target.value)}/>
              </div>

              <div className={styles.divisoes}>
                <label htmlFor="">Div.</label>
                <input type="number" name="" id="" value={divisao} onChange={(e) => setDivisao(e.target.value)}/>
              </div>

              <div className={styles.pep}>
                <label htmlFor="">PEP.</label>
                <input type="number" name="" id="" value={pep} onChange={(e) => setPep(e.target.value)}/>
              </div>

              <div className={styles.moeda}>
                <label htmlFor="">Moeda</label>
                <select name="" id="">
                  <option value="">Selecionar</option>
                  <option value="">BRL</option>
                  <option value="">ARS</option>
                  <option value="">USD</option>
                </select>
              </div>

              <div className={styles.distancia}>
                <label htmlFor=""> Dist. / KM</label>
                <input type="text" value={distanciaKm} onChange={(e) => setDistanciaKm(e.target.value)} />
              </div>

              <div className={styles.valorKM}>
                <label htmlFor="">Valor / KM</label>
                <input type="number" name="" id="" value={valorKm} onChange={(e) => setValorKm(e.target.value)}/>
              </div>

              <div className={styles.valorFaturado}>
                <label htmlFor="">Val. Faturado</label>
                <input type="number" name="" id="" value={valorFaturado} onChange={(e) => setValorFaturado(e.target.value)} />
              </div>

              <div className={styles.despesa}>
                <label htmlFor="">Valor</label>
                <input type="number" name="" id="" value={despesa} onChange={(e) => setDespesa(e.target.value)}/>
              </div>

              <div className={styles.botoes}>
                <button className={styles.botaoSalvar} onClick={handleSubmit}>+ Salvar</button>
                <button className={styles.customerDelete} onClick={limparCampos}><img src={Deletar} alt="" /></button>
              </div>
            </div>


          </form>

          {/*tag principal qie vai envolver a tabela */}
          {/*thread é a tag que agrupa o cabeçalho*/}
          {/*tr é a linha da tabela*/}
          {/* tbody agrupa o corpo da tabela*/}
          <div className={styles.containerTable}>   
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Colaborador(a)</th>
                <th>Empresa</th>
                <th>Nº Prest.</th>
                <th>Data</th>
                <th>Motivo</th>
                <th>Tipo De Destepas</th>
                <th>CTR. Custos</th>
                <th>Ord. Int.</th>
                <th>Div.</th>
                <th>Pep</th>
                <th>Moeda</th>
                <th>Dis. KM</th>
                <th>val faturado</th>
                <th>Despesa</th>
              </tr>
            </thead>
            <tbody>
              {dadosReembolso.map((item, index) => (
                <tr key={index}>
              <td> </td>
              <td> {item.colaborador} </td>
              <td> {item.empresa} </td>
              <td>{item.nPrestacao}</td>
              <td>{item.data}</td>
              <td> </td>
              <td>{item.tipoReembolso}</td>
              <td>{item.centroCusto}</td>
              <td>{item.ordemInterna}</td>
              <td>{item.divisao}</td>
              <td>{item.pep}</td>
              <td>{item.moeda}</td>
              <td>{item.distanciaKm}</td>
              <td>{item.valorKm}</td>
              <td>{item.valorFaturado}</td>
              <td>{item.despesa}</td>
              </tr>
              )) }
              <tr>
                <td>
                  {" "}
                  <img src={Lixeira} alt="" />
                </td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>
                  {" "}
                  <img src={Motivo} alt="" />
                </td>
                <td>200</td>
                <td>500</td>
                <td>100</td>
                <td>200</td>
                <td>300</td>
                <td>300</td>
                <td>200</td>
                <td>500</td>
                <td>300</td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <img src={Lixeira} alt="" />
                </td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>
                  {" "}
                  <img src={Motivo} alt="" />
                </td>
                <td>200</td>
                <td>500</td>
                <td>100</td>
                <td>200</td>
                <td>300</td>
                <td>300</td>
                <td>200</td>
                <td>500</td>
                <td>300</td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <img src={Lixeira} alt="" />
                </td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>gabriel</td>
                <td>
                  {" "}
                  <img src={Motivo} alt="" />
                </td>
                <td>200</td>
                <td>500</td>
                <td>100</td>
                <td>200</td>
                <td>300</td>
                <td>300</td>
                <td>200</td>
                <td>500</td>
                <td>300</td>
              </tr>
            </tbody>
          </table>
          </div>
        </main>
        <footer className={styles.containerFooter}>
            <div className={styles.inputFooterFaturado}>
                <label htmlFor="">Total Faturado</label>
                <input type="text" />
            </div>
            <div className={styles.inputFooterDespesa}>
                <label htmlFor="">Total Despesa</label>
                <input type="text" />
            </div>

            <div>
              <button className={styles.buttonCheck}> 
                <img src={Check} alt="" />
                <p>Enviar para Análise</p>
              </button>
            </div>

            <div>
              <button className={styles.buttonX}>
                <img src={IconeX} alt="" />
                <p>Cancelar Solicitação</p>
              </button>
            </div>

            </footer>
      </div>
    </div>
  );
}
export default Solicitacao;