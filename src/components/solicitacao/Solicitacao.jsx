import styles from "./Solicitacao.module.scss";
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
  return (
    <div className={styles.layoutSolicitacao}>
      <NavBar />

      <div className={styles.containerPrincipalSolicitacao}>

        <header className={styles.headerSolicitacao}>
          <img src={Home} alt="Botão de home" />
          <img src={Seta} alt="Seta indicativa do home" />
          <p>Reembolsos</p>
          <img src={Seta} alt="" />
          <p>Solicitação de Reembolso</p>
        </header>

        <main className={styles.mainSolicitacao}>

          <form className={styles.formSolicitacao}>

            <div className={styles.grupo1}>
              <div className={styles.inputNome}>
                <label htmlFor="">Nome Completo</label>
                <input type="text" />
              </div>

              <div className={styles.inputEmpresa}>
                <label htmlFor="">Empresa</label>
                <input type="text" />
              </div>

              <div className={styles.inputPrestacao}>
                <label htmlFor="">Nº Prest. Contas</label>
                <input type="text" />
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
                <input type="date" name="" id="" />
                
                
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
                <input type="number" name="" id="" />
              </div>

              <div className={styles.divisoes}>
                <label htmlFor="">Div.</label>
                <input type="number" name="" id="" />
              </div>

              <div className={styles.pep}>
                <label htmlFor="">PEP.</label>
                <input type="number" name="" id="" />
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
                <input type="text" />
              </div>

              <div className={styles.valorKM}>
                <label htmlFor="">Valor / KM</label>
                <input type="number" name="" id="" />
              </div>

              <div className={styles.valorFaturado}>
                <label htmlFor="">Val. Faturado</label>
                <input type="number" name="" id="" />
              </div>

              <div className={styles.despesa}>
                <label htmlFor="">Valor</label>
                <input type="number" name="" id="" />
              </div>

              <div className={styles.botoes}>
                <button className={styles.botaoSalvar}>+ Salvar</button>
                <button className={styles.customerDelete}><img src={Deletar} alt="" /></button>
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