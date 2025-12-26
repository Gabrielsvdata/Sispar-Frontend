// src/components/graficos/Graficos.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar.jsx";
import BottomNav from "../navbar/BottomNav.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import Api from "../../Services/Api.jsx";
import { Loading } from "../ui/Loading.jsx";
import styles from "./Graficos.module.scss";

import HomeIcon from "../../assets/Dashboard/home header.png";
import SetaIcon from "../../assets/Dashboard/Vector.png";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28BFE", "#FE8BF0", "#FF4C4C", "#8884d8",
  "#82ca9d", "#ffc658", "#ff7300", "#413ea0"
];

export default function Graficos() {
  const [reembolsos, setReembolsos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("pie"); // pie, bar, line
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data } = await Api.get("/reembolsos/");
      setReembolsos(data);
    } catch (err) {
      console.error("Erro ao buscar dados de reembolsos:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filtra reembolsos por data e status
  const filteredReembolsos = useMemo(() => {
    return reembolsos.filter(r => {
      const dateOnly = r.data ? r.data.split("T")[0] : '';
      const afterFrom = dateFrom ? dateOnly >= dateFrom : true;
      const beforeTo = dateTo ? dateOnly <= dateTo : true;
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      return afterFrom && beforeTo && matchesStatus;
    });
  }, [reembolsos, dateFrom, dateTo, statusFilter]);

  // Dados para gráfico de pizza - Quantidade por tipo de despesa
  const pieData = useMemo(() => {
    const counts = filteredReembolsos.reduce((acc, cur) => {
      const tipo = cur.tipo_reembolso || "Sem categoria";
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredReembolsos]);

  // Dados para gráfico de barras - Valor total por tipo de despesa
  const barData = useMemo(() => {
    const totals = filteredReembolsos.reduce((acc, cur) => {
      const tipo = cur.tipo_reembolso || "Sem categoria";
      acc[tipo] = (acc[tipo] || 0) + (Number(cur.despesa) || 0);
      return acc;
    }, {});
    return Object.entries(totals).map(([name, total]) => ({
      name,
      total: parseFloat(total.toFixed(2)),
    }));
  }, [filteredReembolsos]);

  // Dados para gráfico de linha - Evolução mensal
  const lineData = useMemo(() => {
    const monthlyData = filteredReembolsos.reduce((acc, cur) => {
      if (!cur.data) return acc;
      const date = new Date(cur.data);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[month]) {
        acc[month] = { month, total: 0, count: 0 };
      }
      acc[month].total += Number(cur.despesa) || 0;
      acc[month].count += 1;
      return acc;
    }, {});

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(d => ({
        month: d.month,
        total: parseFloat(d.total.toFixed(2)),
        count: d.count,
      }));
  }, [filteredReembolsos]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const total = filteredReembolsos.reduce((sum, r) => sum + (Number(r.despesa) || 0), 0);
    const aprovados = filteredReembolsos.filter(r => r.status === "Aprovado").length;
    const rejeitados = filteredReembolsos.filter(r => r.status === "Rejeitado").length;
    const emAnalise = filteredReembolsos.filter(r => r.status === "Em análise").length;

    return {
      total: total.toFixed(2),
      count: filteredReembolsos.length,
      aprovados,
      rejeitados,
      emAnalise,
    };
  }, [filteredReembolsos]);

  if (loading) {
    return (
      <div className={styles.container}>
        <NavBar />
        <BottomNav />
        <Loading fullScreen message="Carregando gráficos..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <BottomNav />

      <main className={styles.mainGrafico}>
        <header className={styles.header}>
          <img 
            src={HomeIcon} 
            alt="Início" 
            onClick={() => navigate("/reembolsos")}
            style={{ cursor: 'pointer' }} 
          />
          <img src={SetaIcon} alt="seta" />
          <p 
            onClick={() => navigate("/historico")}
            style={{ cursor: 'pointer', fontWeight: 'normal' }}
          >
            Histórico 
          </p>
          <img src={SetaIcon} alt="seta" />
          <p>Gráficos</p>
        </header>

        {/* Filtros */}
        <section className={styles.filters}>
          <div className={styles.dateFilters}>
            <label>
              De:
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </label>
            <label>
              Até:
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </label>
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
            <option value="Em análise">Em análise</option>
          </select>
          <button 
            className={styles.btnLimparFiltros}
            onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter(''); }}
          >
            <span>🔄</span> Limpar Filtros
          </button>
        </section>

        {/* Estatísticas */}
        <section className={styles.statsCards}>
          <div className={styles.statCard}>
            <h3>Total Despesas</h3>
            <p className={styles.statValue}>R$ {stats.total}</p>
            <span>{stats.count} reembolsos</span>
          </div>
          <div className={styles.statCard}>
            <h3>Aprovados</h3>
            <p className={styles.statValue} style={{color: '#00C49F'}}>{stats.aprovados}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Rejeitados</h3>
            <p className={styles.statValue} style={{color: '#FF8042'}}>{stats.rejeitados}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Em Análise</h3>
            <p className={styles.statValue} style={{color: '#FFBB28'}}>{stats.emAnalise}</p>
          </div>
        </section>

        {/* Seletor de tipo de gráfico */}
        <section className={styles.chartTypeSelector}>
          <button 
            className={chartType === 'pie' ? styles.active : ''}
            onClick={() => setChartType('pie')}
          >
            <span className={styles.icon}>🍰</span>
            <span className={styles.label}>Gráfico de Pizza</span>
          </button>
          <button 
            className={chartType === 'bar' ? styles.active : ''}
            onClick={() => setChartType('bar')}
          >
            <span className={styles.icon}>📊</span>
            <span className={styles.label}>Gráfico de Barras</span>
          </button>
          <button 
            className={chartType === 'line' ? styles.active : ''}
            onClick={() => setChartType('line')}
          >
            <span className={styles.icon}>📈</span>
            <span className={styles.label}>Evolução Mensal</span>
          </button>
        </section>

        {/* Título do gráfico atual */}
        <div className={styles.pageTitleContainer}>
          <h2>
            {chartType === 'pie' && 'Quantidade de Despesas por Categoria'}
            {chartType === 'bar' && 'Valor Total por Tipo de Despesa'}
            {chartType === 'line' && 'Evolução Mensal de Despesas'}
          </h2>
        </div>

        {/* Gráficos */}
        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={120} 
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Quantidade"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, "Total"]} />
              <Legend />
              <Bar dataKey="total" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="total" 
                stroke="#0088FE" 
                name="Valor Total (R$)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="count" 
                stroke="#00C49F" 
                name="Quantidade"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        </main>
    </div>
  );
}