import Home from "../../assets/Header/botão - Home.png"
import Historico from "../../assets/Header/Botão - Histórico.png"
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png"
import Reembolso from "../../assets/Header/Botão - Reembolso.png"
import Sair from "../../assets/Header/Botão - Sair.png"
import People from "../../assets/Header/image.png"
import FecharHearder from "../../assets/Header/imagem-fechar-header.png"
import styles from "./NavBar.module.scss"
import {useNavigate} from "react-router-dom"

function NavBar (){

const navigate = useNavigate()

    return(
      <nav className={styles.navBarEstilo}>
        <button>
            <img src={FecharHearder}/>
        </button>

        <section>
            <img src={People} alt="" />

<div>
        <button onClick={() => {
            navigate("/reembolsos");
        }}>
            <img src={Home} alt="Botão do Home" />
        </button>

        <button>
            <img src={Reembolso} alt="" />
        </button>

        <button>
            <img src={Pesquisa} alt="" />
        </button>

        <button>
            <img src={Historico} alt="" />
        </button>
</div>
        </section>

      

        <button className={styles.buttonSair}  onclick={()=>{navigate("/")}}>
            <img src={Sair} alt="" />
        </button>
      </nav>
    )
}

export default NavBar;