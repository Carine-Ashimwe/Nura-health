import { Suspense } from "react";
import ScreeningForm from "@/components/ScreeningForm";

export default function ScreeningPage() {
  return (
    <Suspense fallback={<main className="screen bg-mint" />}>
      <ScreeningForm />
    </Suspense>
  );
}
