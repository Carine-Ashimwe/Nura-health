"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const PROV_LABEL: Record<string, string> = {
  East: "Eastern",
  Kigali: "Kigali City",
  North: "Northern",
  South: "Southern",
  West: "Western",
};

export interface LocationValue {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

async function load(params: Record<string, string>): Promise<string[]> {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`/api/locations${qs ? `?${qs}` : ""}`);
  if (!r.ok) return [];
  const d = await r.json();
  return d.options || [];
}

export default function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
}) {
  const t = useTranslations("location");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Load provinces, then any pre-selected chain (used when editing the profile).
  useEffect(() => {
    (async () => {
      setProvinces(await load({}));
      const { province, district, sector, cell } = value;
      if (province) setDistricts(await load({ province }));
      if (province && district) setSectors(await load({ province, district }));
      if (province && district && sector) setCells(await load({ province, district, sector }));
      if (province && district && sector && cell)
        setVillages(await load({ province, district, sector, cell }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onProvince(province: string) {
    onChange({ province, district: "", sector: "", cell: "", village: "" });
    setDistricts(province ? await load({ province }) : []);
    setSectors([]);
    setCells([]);
    setVillages([]);
  }
  async function onDistrict(district: string) {
    onChange({ ...value, district, sector: "", cell: "", village: "" });
    setSectors(district ? await load({ province: value.province, district }) : []);
    setCells([]);
    setVillages([]);
  }
  async function onSector(sector: string) {
    onChange({ ...value, sector, cell: "", village: "" });
    setCells(sector ? await load({ province: value.province, district: value.district, sector }) : []);
    setVillages([]);
  }
  async function onCell(cell: string) {
    onChange({ ...value, cell, village: "" });
    setVillages(
      cell ? await load({ province: value.province, district: value.district, sector: value.sector, cell }) : [],
    );
  }

  const opt = (list: string[], label?: (s: string) => string) => [
    <option key="" value="">
      {t("select")}
    </option>,
    ...list.map((x) => (
      <option key={x} value={x}>
        {label ? label(x) : x}
      </option>
    )),
  ];

  return (
    <>
      <div>
        <label className="label block">{t("province")}</label>
        <select className="field" value={value.province} onChange={(e) => onProvince(e.target.value)}>
          {opt(provinces, (p) => PROV_LABEL[p] || p)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="min-w-0">
          <label className="label block">{t("district")}</label>
          <select className="field" value={value.district} disabled={!value.province} onChange={(e) => onDistrict(e.target.value)}>
            {opt(districts)}
          </select>
        </div>
        <div className="min-w-0">
          <label className="label block">{t("sector")}</label>
          <select className="field" value={value.sector} disabled={!value.district} onChange={(e) => onSector(e.target.value)}>
            {opt(sectors)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="min-w-0">
          <label className="label block">{t("cell")}</label>
          <select className="field" value={value.cell} disabled={!value.sector} onChange={(e) => onCell(e.target.value)}>
            {opt(cells)}
          </select>
        </div>
        <div className="min-w-0">
          <label className="label block">{t("village")}</label>
          <select className="field" value={value.village} disabled={!value.cell} onChange={(e) => onChange({ ...value, village: e.target.value })}>
            {opt(villages)}
          </select>
        </div>
      </div>
    </>
  );
}
