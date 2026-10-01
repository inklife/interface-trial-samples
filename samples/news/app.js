"use strict";
const byId = id => document.getElementById(id);
let state, debounce;
const staticMode = document.body.dataset.mode === "static";
let staticData;
function params() {
  const query = new URLSearchParams();
  if (byId("keyword").value.trim()) query.set("q", byId("keyword").value.trim());
  if (byId("source-filter").value) query.set("source", byId("source-filter").value);
  return query.toString();
}
function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
}
function message(text, error = false) {
  byId("messages").replaceChildren(node("div", text, "notice" + (error ? " error" : "")));
}
function dateText(value) {
  if (!value) return "Date not supplied";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date(value)) + " UTC";
}
function render(data) {
  state = data;
  byId("total-count").textContent = data.total;
  byId("nav-count").textContent = data.total;
  byId("result-count").textContent = data.items.length;
  byId("total-sources").textContent = data.sources.length;
  byId("source-count").textContent = data.sources.length;
  const allFixtures = data.sources.every(source => source.kind === "fixture");
  document.querySelector(".top-badge").lastChild.textContent = allFixtures ? " FIXTURE MODE" : " CONFIGURED FEEDS";
  byId("source-mode").textContent = allFixtures ? "Synthetic RSS fixtures" : "Locally configured RSS sources";
  if (data.last_run) {
    const last = new Date(data.last_run);
    byId("last-time").textContent = last.toISOString().slice(11, 16) + " UTC";
    byId("last-date").textContent = last.toISOString().slice(0, 10);
  }
  if (byId("source-filter").options.length === 1) {
    data.sources.forEach(source => {
      const option = node("option", source.name); option.value = source.id;
      byId("source-filter").append(option);
      const row = node("div", undefined, "source-row");
      row.append(node("span", undefined, "source-dot"), node("span", source.name));
      byId("source-list").append(row);
    });
  }
  const list = byId("headlines"); list.replaceChildren();
  if (!data.items.length) list.append(node("div", "No headlines match. Try another keyword or source.", "empty"));
  data.items.forEach((item, index) => {
    const article = node("article", undefined, "headline");
    article.append(node("span", String(index + 1).padStart(2, "0"), "headline-index"));
    const body = node("div", undefined, "headline-body");
    const top = node("div", undefined, "headline-top");
    top.append(node("span", item.source, "source-label " + item.source_id), node("time", dateText(item.published_at)));
    if (item.sample) top.append(node("span", "SYNTHETIC SAMPLE", "sample-tag"));
    body.append(top);
    const link = node("a"); link.href = item.url; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.append(node("h3", item.title));
    body.append(link, node("span", new URL(item.url).hostname, "domain"));
    article.append(body, node("span", "↗", "headline-arrow")); list.append(article);
  });
  byId("export-link").href = staticMode ? "#export" : "/api/export.csv" + (params() ? "?" + params() : "");
  byId("filter-status").textContent = params() ? "FILTERED HEADLINES · " + data.items.length + " RESULTS" : "ALL HEADLINES";
}
async function load() {
  if (staticMode) {
    if (!staticData) {
      const response = await fetch("demo-data.json");
      if (!response.ok) throw new Error("Could not load the synthetic sample metadata");
      staticData = await response.json();
    }
    const escaped = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const words = byId("keyword").value.trim().toLowerCase().split(/\s+/).filter(Boolean).map(word => new RegExp("(^|[^\\p{L}\\p{N}_])" + escaped(word) + "(?=$|[^\\p{L}\\p{N}_])", "u"));
    const source = byId("source-filter").value;
    const items = staticData.items.filter(item => (!source || item.source_id === source) && words.every(word => word.test(item.title.toLowerCase())));
    render({ ...staticData, items });
    return;
  }
  const response = await fetch("/api/state" + (params() ? "?" + params() : ""));
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not load headlines");
  render(data);
}
byId("keyword").addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => load().catch(error => message(error.message, true)), 160);
});
byId("source-filter").addEventListener("change", () => load().catch(error => message(error.message, true)));
byId("collect-button").addEventListener("click", async () => {
  const button = byId("collect-button"); button.disabled = true;
  message("Collecting the configured RSS feeds…");
  try {
    if (staticMode) {
      // This static preview has no server collector. Reload the same synthetic
      // dataset and make this limitation visible in its result message.
      await load();
      message("Static preview: " + staticData.total + " synthetic headlines loaded. Collection is simulated here; the Python app parses the actual fixture RSS files.");
      return;
    }
    const response = await fetch("/api/collect", { method: "POST", headers: { "Content-Type": "application/json", "X-Scout-Token": state.token }, body: JSON.stringify({ source_ids: state.sources.map(source => source.id) }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Collection failed");
    await load();
    message("Collection complete: " + result.inserted + " new headlines, " + result.duplicates + " duplicates skipped." + (result.errors.length ? " " + result.errors.map(error => error.source_id + ": " + error.message).join("; ") : ""), Boolean(result.errors.length));
  } catch (error) { message(error.message, true); }
  finally { button.disabled = false; }
});
byId("export-link").addEventListener("click", event => {
  if (!staticMode) return;
  event.preventDefault();
  const safe = value => /^[\s]*[=+\-@]/.test(String(value)) ? "'" + value : String(value);
  const cell = value => '"' + safe(value).replaceAll('"', '""') + '"';
  const rows = [["Title", "Published UTC", "Source", "Original URL", "Synthetic sample"], ...state.items.map(item => [item.title, item.published_at, item.source, item.url, item.sample ? "yes" : "no"])];
  const blob = new Blob(["\uFEFF" + rows.map(row => row.map(cell).join(",")).join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = node("a"); link.href = url; link.download = "news-scout-synthetic.csv"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) { event.preventDefault(); byId("keyword").focus(); }
});
load().catch(error => message(error.message, true));
