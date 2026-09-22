"use client";
import { useRef, useState } from "react";
import ProductForm from "./product-form";
type Product = { product_id: string; version: number; dna: Record<string, string> };
const labels: Record<string, string> = { name: "Nome", sku: "Código (SKU)", category: "Categoria", kind: "Tipo", height: "Altura", width: "Largura", depth: "Profundidade", unit: "Unidade", materials: "Materiais", colors: "Cores", components: "Componentes", fixed: "O que deve permanecer igual", variable: "O que pode variar" };
export default function ProductCatalog() {
  const [list, setList] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const active = useRef(false);
  async function load(nextPage = 0) {
    if (active.current) return;
    active.current = true; setList(true); setLoading(true); setError(""); setProducts([]);
    try {
      const response = await fetch(`/api/products?page=${nextPage}`, { cache: "no-store", signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.products)) { setError(data.error ?? "Não foi possível consultar os produtos."); return; }
      setProducts(data.products); setMore(data.hasMore === true); setPage(nextPage);
    } catch { setError("Não foi possível consultar os produtos. Tente novamente."); }
    finally { active.current = false; setLoading(false); heading.current?.focus(); }
  }
  return <>
    <div className="product-actions catalog-nav">
      <button type="button" className="signout" disabled={loading} onClick={() => load()}>Consultar produtos salvos</button>
      {list ? <button type="button" className="signout" disabled={loading} onClick={() => setList(false)}>Cadastrar produto</button> : null}
    </div>
    {list ? <section className="product-page product-review">
      <h1 ref={heading} tabIndex={-1}>Produtos salvos</h1>
      <p className="intro">Primeira versão dos produtos da sua equipe.</p>
      {loading ? <p role="status">Consultando produtos…</p> : error ? <p role="alert" className="form-error">{error}</p> : <>
        {!products.length ? <p>Nenhum produto cadastrado nesta página.</p> : products.map(product => <details className="panel" key={product.product_id}>
          <summary><strong>{product.dna.name}</strong> · {product.dna.sku}</summary>
          <p>Versão {product.version}</p><dl>{Object.entries(labels).map(([field,label]) => <div key={field}><dt>{label}</dt><dd>{typeof product.dna[field] === "string" && product.dna[field] ? product.dna[field] : "Não informado"}</dd></div>)}</dl>
        </details>)}
        <div className="product-actions"><button type="button" className="signout" disabled={page === 0} onClick={() => load(page - 1)}>Página anterior</button><span>Página {page + 1}</span><button type="button" className="signout" disabled={!more} onClick={() => load(page + 1)}>Próxima página</button></div>
      </>}
    </section> : <ProductForm />}
  </>;
}
