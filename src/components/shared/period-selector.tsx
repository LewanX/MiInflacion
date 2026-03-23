"use client";

import { MESES } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  mesDesde: number;
  anioDesde: number;
  mesHasta: number;
  anioHasta: number;
  years: number[];
  onMesDesdeChange: (v: number) => void;
  onAnioDesdeChange: (v: number) => void;
  onMesHastaChange: (v: number) => void;
  onAnioHastaChange: (v: number) => void;
  mesesDesdeDisponibles?: number[];
  mesesHastaDisponibles?: number[];
}

export function PeriodSelector({
  mesDesde,
  anioDesde,
  mesHasta,
  anioHasta,
  years,
  onMesDesdeChange,
  onAnioDesdeChange,
  onMesHastaChange,
  onAnioHastaChange,
  mesesDesdeDisponibles,
  mesesHastaDisponibles,
}: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground">Período:</span>
      <div className="flex items-center gap-2">
        <Select
          value={String(mesDesde)}
          onValueChange={(v) => onMesDesdeChange(Number(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              {MESES[mesDesde - 1]?.slice(0, 3)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MESES.map((mes, i) => (
              <SelectItem
                key={i}
                value={String(i + 1)}
                disabled={
                  mesesDesdeDisponibles
                    ? !mesesDesdeDisponibles.includes(i + 1)
                    : false
                }
              >
                {mes}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(anioDesde)}
          onValueChange={(v) => onAnioDesdeChange(Number(v))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ArrowRight className="size-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Select
          value={String(mesHasta)}
          onValueChange={(v) => onMesHastaChange(Number(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              {MESES[mesHasta - 1]?.slice(0, 3)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MESES.map((mes, i) => (
              <SelectItem
                key={i}
                value={String(i + 1)}
                disabled={
                  mesesHastaDisponibles
                    ? !mesesHastaDisponibles.includes(i + 1)
                    : false
                }
              >
                {mes}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(anioHasta)}
          onValueChange={(v) => onAnioHastaChange(Number(v))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
