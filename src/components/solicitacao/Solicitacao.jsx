import styles from "./Solicitacao.module.scss";
import {useState } from "react"; 
import { useNavigate } from "react-router-dom";
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
//import IconeMais from "../../assets/solicitacao/+.png"
import Check from "../../assets/solicitacao/check.png"

function Solicitacao() {
  const navigate = useNavigate();
 // const [createdNumPrestacao, setCreatedNumPrestacao] = useState(null);
  const [colaborador, setColaborador] = useState(""); // Estado para o campo colaborador
  const [empresa, setEmpresa] = useState(""); // Estado para o campo empresa
  const [descricao, setDescricao] = useState(""); // Estado para o campo  descrição
  const [data, setData] = useState(""); // Estado para o campo data
  const [motivo, setMotivo] = useState(""); // Estado para o campo motivo  //ESSE ESTADO É PARA QUEM TÁ FAZENDO AVANÇADO UTILIZANDO MODAL
  const [tipoReembolso, setTipoReembolso] = useState(""); // Estado para o campo tipo de reembolso
  const [centroCusto, setCentroCusto] = useState(""); // Estado para o campo centro de custo
  const [ordemInterna, setorOrdemInterna] = useState(""); // Estado para o campo ordem interna
  const [divisao, setDivisao] = useState(""); //  pep
  const [moeda, setMoeda] = useState(""); // Estado para o caEstado para o campo divisão
  const [pep, setPep] = useState(""); // Estado para o campompo moeda
  const [distanciaKm, setDistanciaKm] = useState(""); // Estado para o campo distância km
  const [valorKm, setValorKm] = useState(""); // Estado para o campo valor km
  const [valorFaturado, setValorFaturado] = useState(""); // Estado para o campo valor faturado
  const [despesa, setDespesa] = useState(""); // Estado para o campo despesa
  const[dadosReembolso, setDadosReembolso] = useState([]);

 //impar campos dos inputs 
  const limparCampos = () => {
    setColaborador(""),
    setEmpresa(""),
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

 
    // -> LÓGICA DO “+ Salvar” (gera no servidor o num_prestacao e adiciona na tabela)
  const handleSubmit = async () => {
    if (!colaborador || !empresa || !data) {
      alert("Por favor, preencha os campos obrigatórios: Colaborador, Empresa e Data.");
      return;
    }

  try {
    const colaboradorId = Number(localStorage.getItem("usuarioId"));
    const item = {
    colaborador,
    empresa,
    descricao,
    data,
    tipo_reembolso: tipoReembolso,
    centro_custo: centroCusto,
    ordem_interna: ordemInterna,
    divisao,
    pep,
    moeda,
    distancia_km: distanciaKm,
    valor_km: Number(valorKm),
    valor_faturado: Number(valorFaturado),
    despesa: Number(despesa) || 0,
    id_colaborador: colaboradorId,
  };

    // 1) crio no servidor e recebo o objeto completo
  //  const { data: { reembolso } } = await Api.post("/reembolsos/new", payload);

    // 2) atualizo o input de Nº Prestação com o gerado agora
    //setCreatedNumPrestacao(reembolso.num_prestacao);

    // 3) adiciono esse reembolso (com num_prestacao) na lista
    setDadosReembolso(prev => [...prev, item]);

    limparCampos();
  } catch (error) {
    const msg = error.response?.data?.erro || error.message;
    alert(`Erro ao salvar: ${msg}`);
  }
};

const enviarParaAnalise = async () => {
  if (dadosReembolso.length === 0) {
    alert("Não há itens para enviar.");
    return;
  }
  if (!window.confirm("Deseja enviar todas para análise?")) return;

  try {
    const responses = await Promise.all(
      dadosReembolso.map(item => Api.post("/reembolsos/new", item))
    );
    const criados = responses.map(r => r.data.reembolso);

    setDadosReembolso([]);
    navigate("/analise", { state: { itens: criados } });
  } catch (err) {
    const msg = err.response?.data?.erro || err.message;
    alert(`Erro ao enviar para análise: ${msg}`);
  }
};
const removerReembolso = idx => {
  setDadosReembolso(prev => prev.filter((_, i) => i !== idx));
};

const cancelarSolicitacao = async () => {
  if (dadosReembolso.length === 0) {
    alert("Nada a cancelar.");
    return;
  }

  const confirma = window.confirm("Deseja realmente cancelar a solicitação?");
  if (!confirma) {
    return;
  }

  try {
    await Promise.all(
      dadosReembolso.map(item =>
        Api.delete(`/reembolsos/${item.num_prestacao}`)
      )
    );
    setDadosReembolso([]);
    alert("Solicitação cancelada com sucesso!");
  } catch (err) {
    const msg = err.response?.data?.erro || err.message;
    alert(`Erro ao cancelar: ${msg}`);
  }
};

const totalFaturado = dadosReembolso
  .reduce((soma, item) => soma + Number(item.valor_faturado || 0), 0);
const totalDespesa = dadosReembolso
  .reduce((soma, item) => soma + Number(item.despesa || 0), 0);



  return (
    
    <div className={styles.layoutSolicitacao}>
      <NavBar />

     {/* 1) Motivo */}
      {motivo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Motivo do Reembolso</h3>
            <p>{motivo}</p>
            <button onClick={() => setMotivo("")}>Fechar</button>
          </div>
        </div>
      )}
      
      <div className={styles.containerPrincipalSolicitacao}>
      <main className={styles.mainSolicitacao}>
        <header className={styles.headerSolicitacao}>
          <img src={Home} alt="home" onClick={() => navigate("/reembolsos")}/>
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
                <label>Nº Prest. Contas</label>
               <input
                type="text"
                readOnly
                placeholder="Será gerado pelo sistema"
                />
              </div>

              <div className={styles.inputMotivo}>
                <label htmlFor=""> Descrição / Motivo do Reembolso </label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4" cols="50">
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

                {/* Tipo de Despesa */}
              <select
                value={tipoReembolso}
                  onChange={e => setTipoReembolso(e.target.value)}
                  name="tipoReembolso">
                    <option value="">Selecionar</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Combustível">Combustível</option>
                    <option value="Condução">Condução</option>
                    <option value="Estacionamento">Estacionamento</option>
                    <option value="Viagem Administrativa">Viagem Administrativa</option>
                    <option value="Viagem Operacional">Viagem Operacional</option>
                    <option value="Eventos de representação">Eventos de representação</option>
                    </select>
              </div>

              <div className={styles.centroDeCusto}>
                <label htmlFor="">Centro de Custo</label>
                <img className={styles.imgCustos}src={setaBaixo} alt="" />
               <select
                  value={centroCusto}
                  onChange={e => setCentroCusto(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="1100109002">1100109002 – FIM CONTROLES INTERNOS MTZ</option>
                  <option value="1100110002">1100110002 – FIN VICE-PRESIDÊNCIA FINANÇAS MTZ</option>
                  <option value="1100110101">1100110101 – FIN CONTABILIDADE MTZ</option>
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
                <select
                id="moeda"
                name="moeda"
                value={moeda}
                onChange={e => setMoeda(e.target.value)}
              >
                <option value="">Selecionar</option>
                <option value="BRL">BRL</option>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
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
                <label htmlFor="Despesas">Despesa</label>
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
                <th>NºPrest.</th>
                <th>Data</th>
                <th>Motivo</th>
                <th>Tipo De Destepas</th>
                <th>CTR. Custos</th>
                <th>Ord. Int.</th>
                <th>Div.</th>
                <th>Pep</th>
                <th>Moeda</th>
                <th>Dis.KM</th>
                <th>Valor.KM</th>
                <th>Val.Faturado</th>
                <th>Despesa</th>
              </tr>
            </thead>

            <tbody>
          {dadosReembolso.map((item, index) => (
                <tr key={index}>
              <td> 
                {" "}
                <img  src={Lixeira} alt="Remover" style={{ cursor: 'pointer' }} onClick={() => removerReembolso(index)}  />{" "}
              </td>
              <td> {item.colaborador} </td>
              <td> {item.empresa} </td>
              <td>{item.num_prestacao}</td>
              <td> { item.data? new Date(item.data).toLocaleDateString("pt-BR"): ""}</td>
              <td  onClick={() => setMotivo(item.descricao)}
        style={{ cursor: "pointer" }}>
                <img src={Motivo} alt="" onClick={() => setMotivo(item.descricao)}
        style={{ cursor: "pointer" }} />
              </td>
              <td>{item.tipo_reembolso}</td>
              <td>{item.centro_custo}</td>
              <td>{item.ordem_interna}</td>
              <td>{item.divisao}</td>
              <td>{item.pep}</td>
              <td>{item.moeda}</td>
              <td>{item.distancia_km}</td>
              <td>{item.valor_km}</td>
              <td>{item.valor_faturado}</td>
              <td>{item.despesa}</td>
              </tr>
              )) }
            </tbody>
          </table>
          </div>
        </main>
        <footer className={styles.containerFooter}>
            <div className={styles.inputFooterFaturado}>
                <label htmlFor="">Total Faturado</label>
                <input id="totalFaturado"
                type="text"
                value={totalFaturado.toFixed(2).replace('.', ',')}
                readOnly />
            </div>
            <div className={styles.inputFooterDespesa}>
                <label htmlFor="">Total Despesa</label>
                <input  id="totalDespesa"
                type="text"
                value={totalDespesa.toFixed(2).replace('.', ',')}
                readOnly/>
            </div>

            <div>
              <button className={styles.buttonCheck} onClick={enviarParaAnalise}> 
                <img src={Check} alt="" />
                Enviar Para Analise
              </button>
            </div>

            <div>
              <button className={styles.buttonX} onClick={cancelarSolicitacao}>
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