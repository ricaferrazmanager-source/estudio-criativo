"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

const fields = [
  { name: "name", label: "Nome do produto", group: 1, required: "Informe o nome do produto." },
  { name: "sku", label: "Código do produto (SKU)", group: 1, required: "Informe o código do produto." },
  { name: "category", label: "Categoria", group: 1, required: "Informe a categoria." },
  { name: "height", label: "Altura", group: 2, required: "Informe a altura.", measure: true },
  { name: "width", label: "Largura", group: 2, required: "Informe a largura.", measure: true },
  { name: "depth", label: "Profundidade", group: 2, required: "Informe a profundidade.", measure: true },
  { name: "materials", label: "Materiais", group: 2, required: "Informe os materiais." },
  { name: "colors", label: "Cores", group: 2, required: "Informe as cores." },
  { name: "fixed", label: "O que deve permanecer igual", group: 3, hint: "Exemplo: manter a cor e não adicionar alças.", multiline: true },
  { name: "variable", label: "O que pode variar", group: 3, hint: "Exemplo: cenário, iluminação e posição da câmera.", multiline: true },
];
const groups = ["Identificação", "Características", "Regras para as imagens"];
type Values = Record<string, string>;
export default function ProductForm() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const submission = useRef<{ id: string; payload: string } | null>(null);
  const inFlight = useRef(false);
  const [kit, setKit] = useState(false);
  const [errors, setErrors] = useState<Values>({});
  const [review, setReview] = useState<Values | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (review) title.current?.focus();
    else (form.current?.elements.namedItem("name") as HTMLInputElement | null)?.focus();
  }, [review]);
  async function save() {
    if (!review || inFlight.current || saved) return;
    inFlight.current = true; setSaving(true); setSaveError("");
    const payload = JSON.stringify(review);
    if (!submission.current || submission.current.payload !== payload) submission.current = { id: crypto.randomUUID(), payload };
    try {
      const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: submission.current.id, draft: review }), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok || data.id !== submission.current.id) { setSaveError(data.error ?? "Não foi possível confirmar o salvamento. Tente novamente ou consulte os produtos salvos."); return; }
      setSaved(true);
    } catch { setSaveError("Não foi possível confirmar o salvamento. Tente novamente sem alterar os dados ou consulte os produtos salvos."); }
    finally { inFlight.current = false; setSaving(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: Values = {};
    const nextErrors: Values = {};
    for (const field of fields) {
      const value = String(data.get(field.name) ?? "").trim();
      values[field.name] = value;
      if (field.required && !value) nextErrors[field.name] = field.required;
      else if (field.measure && (!/^\d+(?:[.,]\d+)?$/.test(value) || !Number.isFinite(Number(value.replace(",", "."))) || Number(value.replace(",", ".")) <= 0)) nextErrors[field.name] = "Informe uma medida maior que zero.";
    }
    values.unit = String(data.get("unit"));
    values.kind = kit ? "Kit / conjunto" : "Produto simples";
    values.components = kit ? String(data.get("components") ?? "").trim() : "";
    if (kit && !values.components) nextErrors.components = "Descreva as peças e suas quantidades.";
    setErrors(nextErrors);
    const invalid = Object.keys(nextErrors)[0];
    if (invalid) (event.currentTarget.elements.namedItem(invalid) as HTMLElement | null)?.focus();
    else setReview(values);
  }
  return <section className="product-page">
    <h1 ref={title} tabIndex={-1}>{review ? "Revise o produto" : "Conheça seu produto."}</h1>
    <p className="intro">Reúna as informações que vão orientar a criação das imagens.</p>
    <p className="notice">Revise as informações antes de salvar. Dados ainda não salvos serão perdidos ao sair desta tela ou recarregar a página. Fotos serão adicionadas em outra etapa.</p>
    <form ref={form} onSubmit={submit} noValidate hidden={review !== null}>
      <p className="access-note">Preencha os campos obrigatórios. As regras para as imagens são opcionais.</p>
      {Object.keys(errors).length ? <p role="alert" className="form-error">Confira os campos indicados abaixo.</p> : null}
      {groups.map((group, index) => <fieldset className="product-group" key={group}>
        <legend><span className="product-number">0{index + 1}</span>{group}</legend>
        {index === 1 ? <>
          <label className="product-field" htmlFor="product-kind">Tipo de produto<select id="product-kind" value={kit ? "kit" : "simple"} onChange={e => setKit(e.target.value === "kit")}><option value="simple">Produto simples</option><option value="kit">Kit / conjunto</option></select></label>
          <p className="access-note">Informe as medidas externas reais do produto ou do conjunto montado.</p>
          <label className="product-field" htmlFor="product-unit">Unidade de medida<select id="product-unit" name="unit" defaultValue="cm"><option value="cm">Centímetros (cm)</option><option value="mm">Milímetros (mm)</option><option value="m">Metros (m)</option></select></label>
        </> : null}
        <div className="product-grid">{fields.filter(field => field.group === index + 1).map(field => <div className={field.multiline ? "product-field product-wide" : "product-field"} key={field.name}>
          <label htmlFor={`product-${field.name}`}>{field.label}</label>
          {field.hint ? <small id={`${field.name}-hint`}>{field.hint}</small> : null}
          {field.multiline ? <textarea id={`product-${field.name}`} name={field.name} rows={3} maxLength={2000} aria-describedby={`${field.name}-hint`} /> : <input id={`product-${field.name}`} name={field.name} maxLength={field.measure ? 20 : 160} inputMode={field.measure ? "decimal" : "text"} required={!!field.required} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />}
          {errors[field.name] ? <small className="form-error" id={`${field.name}-error`}>{errors[field.name]}</small> : null}
        </div>)}</div>
        {index === 1 && kit ? <div className="product-field product-components"><label htmlFor="product-components">Componentes do kit</label><small id="components-hint">Descreva cada peça, sua quantidade e suas medidas, se conhecidas.</small><textarea id="product-components" name="components" rows={4} maxLength={2000} required aria-invalid={!!errors.components} aria-describedby={`components-hint${errors.components ? " components-error" : ""}`} />{errors.components ? <small id="components-error" className="form-error">{errors.components}</small> : null}</div> : null}
      </fieldset>)}
      <button type="submit" className="primary">Revisar produto</button>
    </form>
    {review ? <div className="product-review">
      <p className="notice" role="status"><strong>{saved ? "Produto salvo com sucesso." : "Nenhum produto foi salvo."}</strong><br />{saved ? "A primeira versão foi registrada. Consulte os produtos salvos para encontrá-la depois." : "Confira as informações. Você pode voltar para corrigir o preenchimento."}</p>
      {groups.map((group, index) => <section className="panel" key={group}><h2>{group}</h2><dl>
        {index === 1 ? <div><dt>Tipo de produto</dt><dd>{review.kind}</dd></div> : null}
        {fields.filter(field => field.group === index + 1).map(field => <div key={field.name}><dt>{field.label}</dt><dd>{review[field.name] ? `${review[field.name]}${field.measure ? ` ${review.unit}` : ""}` : "Não informado"}</dd></div>)}
        {index === 1 && review.components ? <div><dt>Componentes do kit</dt><dd>{review.components}</dd></div> : null}
      </dl></section>)}
      <div className="product-actions">{!saved ? <><button type="button" className="primary" disabled={saving} onClick={save}>{saving ? "Salvando…" : "Salvar produto"}</button><button type="button" className="signout" disabled={saving} onClick={() => { setSaveError(""); setReview(null); }}>Voltar e corrigir</button></> : null}</div>{saveError ? <p className="form-error" role="alert">{saveError}</p> : null}
    </div> : null}
  </section>;
}
