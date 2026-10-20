"use client";

import dynamic from "next/dynamic";
import { MapPinned, ExternalLink } from "lucide-react";
import { bbrReferencePoints } from "@/lib/bbr-reference";

const GeographicReferenceMap = dynamic(() => import("./GeographicReferenceMap"), {
  ssr: false,
  loading: () => <div className="flex h-[340px] items-center justify-center rounded-xl bg-slate-100 text-slate-600">Loading geographic map…</div>,
});

export default function GeographicReferenceWorkspace() {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="BBR geographic reference map">
      <div className="flex items-center gap-2 text-teal-800"><MapPinned size={19} aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-wide">Geographic reference · WGS84</p></div>
      <h2 className="mt-1 text-xl font-semibold">Bandar Bukit Raja area reference</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">This map uses real geographic coordinates for a small number of source-linked reference points. It does not show verified township boundaries, mapped flood reports, current road conditions or safe routes. Our existing schematic simulation is separate.</p>
      <div className="mt-4"><GeographicReferenceMap /></div>
      <p className="mt-3 text-xs text-slate-600">Background map requires an internet connection. Map data © OpenStreetMap contributors. Reference points use rounded coordinates from listed sources.</p>
      <h3 className="mt-4 font-semibold">Reference points and sources</h3>
      <div className="mt-2 grid gap-3 md:grid-cols-2">
        {bbrReferencePoints.features.map(feature => (
          <article key={feature.properties.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            <h4 className="font-semibold">{feature.properties.name}</h4>
            <p className="mt-1 text-slate-600">{feature.properties.evidence}</p>
            <p className="mt-1 text-xs text-slate-500">WGS84: {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</p>
            <a className="mt-2 inline-flex items-center gap-1 font-semibold text-teal-700 underline"
              href={feature.properties.sourceUrl} target="_blank" rel="noopener noreferrer">
              View mapped source <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-900">REFERENCE ONLY — NOT LIVE FLOOD INTELLIGENCE. Point locations do not establish road access, flood safety or directions.</p>
    </section>
  );
}
