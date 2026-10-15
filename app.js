"use strict";
(() => {
  const p = window.PROYECTO;
  const get = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const percent = value => Math.max(0, Math.min(100, Number(value) || 0));
  const money = value => new Intl.NumberFormat("es-CO", { style: "currency", currency: p.moneda, maximumFractionDigits: 0 }).format(value);
  const compact = value => new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  const date = value => new Date(value + "T12:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  const total = p.presupuesto.reduce((s, item) => ({ previsto: s.previsto + item.previsto, ejecutado: s.ejecutado + item.ejecutado }), { previsto: 0, ejecutado: 0 });
  document.title = `${p.nombre} · OBRA`;
  get("breadcrumb").textContent = p.nombre;
  get("project-name").textContent = p.nombre;
  get("project-location").textContent = p.ubicacion;
  get("project-manager").textContent = `Dirección: ${p.responsable}`;
  get("project-dates").textContent = `${date(p.inicio)} — ${date(p.fin)}`;
  get("updated").textContent = date(p.actualizado);
  get("currency").textContent = p.moneda;
  const gap = p.avanceReal - p.avancePlanificado;
  const delayed = p.actividades.filter(a => a.estado === "Retrasada").length;
  const metrics = [
    { label: "Avance físico", value: p.avanceReal, unit: "%", note: `${gap > 0 ? "+" : ""}${gap} puntos frente al plan`, style: gap < 0 ? "warning" : "positive" },
    { label: "Presupuesto total", value: compact(total.previsto), unit: p.moneda, note: `${p.presupuesto.length} partidas de obra`, style: "" },
    { label: "Costo ejecutado", value: compact(total.ejecutado), unit: p.moneda, note: total.previsto ? `${(total.ejecutado / total.previsto * 100).toFixed(1)}% del presupuesto` : "Sin presupuesto asignado", style: "" },
    { label: "Actividades retrasadas", value: String(delayed).padStart(2, "0"), unit: "", note: delayed ? "Requieren seguimiento" : "Sin retrasos reportados", style: delayed ? "warning" : "positive" }
  ];
  get("metrics").innerHTML = metrics.map(m => `<article class="metric"><div class="metric-label">${escape(m.label)}</div><div class="metric-value">${escape(m.value)}<small>${escape(m.unit)}</small></div><div class="metric-note ${m.style}">${escape(m.note)}</div></article>`).join("");
  get("stages").innerHTML = p.etapas.length ? p.etapas.map(s => `<div><div class="stage-heading"><span>${escape(s.nombre)}</span><strong>${percent(s.avance)}%</strong></div><div class="track" role="progressbar" aria-label="${escape(s.nombre)}" aria-valuenow="${percent(s.avance)}" aria-valuemin="0" aria-valuemax="100"><div class="fill" style="width:${percent(s.avance)}%"></div></div></div>`).join("") : "<p>No hay etapas registradas.</p>";
  const h = p.historial;
  if (h.length) {
    const x = i => 40 + (h.length === 1 ? 230 : i * 460 / (h.length - 1));
    const y = v => 205 - percent(v) * 1.8;
    const points = key => h.map((d, i) => `${x(i)},${y(d[key])}`).join(" ");
    const grid = [0, 25, 50, 75, 100].map(v => `<line x1="40" y1="${y(v)}" x2="500" y2="${y(v)}" stroke="#edf0ee"/><text x="27" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
    const labels = h.map((d, i) => `<text x="${x(i)}" y="228" text-anchor="middle">${escape(d.periodo)}</text>`).join("");
    const dots = h.map((d, i) => `<circle cx="${x(i)}" cy="${y(d.real)}" r="4" fill="#287c63" stroke="white" stroke-width="2"><title>${escape(d.periodo)}: ejecutado ${percent(d.real)}%, planificado ${percent(d.planificado)}%</title></circle>`).join("");
    const description = h.map(d => `${d.periodo}: planificado ${percent(d.planificado)}%, ejecutado ${percent(d.real)}%`).join("; ");
    get("progress-chart").innerHTML = `<svg class="chart" viewBox="0 0 530 240" role="img" aria-labelledby="chart-title chart-description"><title id="chart-title">Avance planificado y ejecutado</title><desc id="chart-description">${escape(description)}</desc>${grid}<polygon points="${x(0)},205 ${points("real")} ${x(h.length - 1)},205" fill="#eef5f0"/><polyline points="${points("planificado")}" fill="none" stroke="#aab9ae" stroke-width="2" stroke-dasharray="5 5"/><polyline points="${points("real")}" fill="none" stroke="#287c63" stroke-width="3"/>${dots}${labels}</svg>`;
  } else get("progress-chart").textContent = "No hay cortes de avance registrados.";
  get("budget-rows").innerHTML = p.presupuesto.map(b => {
    const consumption = b.previsto ? b.ejecutado / b.previsto * 100 : 0;
    return `<tr><td>${escape(b.partida)}</td><td class="numeric">${money(b.previsto)}</td><td class="numeric">${money(b.ejecutado)}</td><td><div class="budget-consumption ${b.ejecutado > b.previsto ? "over" : ""}"><div class="track"><div class="fill" style="width:${percent(consumption)}%"></div></div><span>${b.previsto ? consumption.toFixed(0) + "%" : "Sin asignar"}</span></div></td><td class="numeric ${b.ejecutado > b.previsto ? "warning" : ""}">${money(b.previsto - b.ejecutado)}</td></tr>`;
  }).join("");
  get("budget-total").innerHTML = `<tr><td>Total del proyecto</td><td class="numeric">${money(total.previsto)}</td><td class="numeric">${money(total.ejecutado)}</td><td></td><td class="numeric">${money(total.previsto - total.ejecutado)}</td></tr>`;
  const statuses = { "Completada": "completed", "En curso": "ongoing", "Retrasada": "delayed", "Pendiente": "pending" };
  const normalize = value => value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  function renderActivities() {
    const query = normalize(get("search").value.trim());
    const status = get("status").value;
    const rows = p.actividades.filter(a => (status === "all" || a.estado === status) && normalize(`${a.nombre} ${a.responsable}`).includes(query));
    get("activity-rows").innerHTML = rows.length ? rows.map(a => `<tr><td>${escape(a.nombre)}</td><td>${escape(a.responsable)}</td><td>${date(a.inicio)}</td><td>${date(a.fin)}</td><td>${percent(a.avance)}%</td><td><span class="badge ${statuses[a.estado] || "pending"}">${escape(a.estado)}</span></td></tr>`).join("") : '<tr><td colspan="6">No se encontraron actividades con estos filtros.</td></tr>';
    get("activity-count").textContent = `${rows.length} de ${p.actividades.length} actividades · Estados definidos en el archivo de datos.`;
  }
  get("search").addEventListener("input", renderActivities);
  get("status").addEventListener("change", renderActivities);
  get("print").addEventListener("click", () => window.print());
  renderActivities();
})();
