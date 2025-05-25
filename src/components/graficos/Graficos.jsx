// src/components/graficos/Graficos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Api from "../../Services/Api.jsx";
import styles from "./Graficos.module.scss";

// Importe os ícones que você usa no header das outras páginas
import HomeIcon from "../../assets/Dashboard/home header.png"; // Ajuste o caminho se necessário
import SetaIcon from "../../assets/Dashboard/Vector.png";   // Ajuste o caminho se necessário

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28BFE", "#FE8BF0", "#FF4C4C",
];

export default function Graficos() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Sua lógica para buscar dados para o gráfico continua igual
    async function fetchData() {
      try {
        const { data: reembolsos } = await Api.get("/reembolsos");
        const counts = reembolsos.reduce((acc, cur) => {
          acc[cur.tipo_reembolso] = (acc[cur.tipo_reembolso] || 0) + 1;
          return acc;
        }, {});
        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value,
        }));
        setData(chartData);
      } catch (err) {
        console.error("Erro ao buscar dados de reembolsos:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}> {/* Seu container geral da página */}
      <NavBar />

      <main className={styles.mainGrafico}>
        {/* AQUI ESTÁ O HEADER MODIFICADO PARA SEGUIR O PADRÃO DE BREADCRUMB */}
        <header className={styles.header}> {/* Uso a mesma classe .header que você já tem */}
          <img 
            src={HomeIcon} 
            alt="Início" 
            onClick={() => navigate("/reembolsos")} // Navega para a home (ajuste a rota se for diferente)
            // Adiciono um cursor pointer para indicar que é clicável
            style={{ cursor: 'pointer' }} 
          />
          <img src={SetaIcon} alt="seta" />
          {/* O texto "Histórico" agora também pode ser clicável para voltar */}
          <p 
            onClick={() => navigate("/historico")} // Navega para a tela de Histórico
            style={{ cursor: 'pointer', fontWeight: 'normal' }} // Tiro o bold se não for a página atual
          >
            Histórico 
          </p>
          <img src={SetaIcon} alt="seta" />
          <p>Gráficos</p> {/* Página atual, em negrito */}
        </header>

        {/* Título principal da página, abaixo do breadcrumb */}
        <div className={styles.pageTitleContainer}>
          <h2>Quantidade de Despesas por Categoria</h2>
        </div>

        {/* Seu gráfico continua aqui */}
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, "Quantidade"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
}