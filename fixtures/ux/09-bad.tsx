"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Shipping = { name: string; line1: string; city: string; postal: string };
type Payment = { cardName: string; cardNumber: string; expiry: string; cvc: string };
type Errors = Record<string, string | undefined>;

const emptyShipping: Shipping = { name: "", line1: "", city: "", postal: "" };
const emptyPayment: Payment = { cardName: "", cardNumber: "", expiry: "", cvc: "" };
const steps = ["Shipping", "Payment", "Review"];

function validateShipping(s: Shipping): Errors {
  return {
    name: s.name.trim() ? undefined : "Enter the recipient's name.",
    line1: s.line1.trim() ? undefined : "Enter a street address.",
    city: s.city.trim() ? undefined : "Enter a city.",
    postal: s.postal.trim() ? undefined : "Enter a postal code.",
  };
}

function validatePayment(p: Payment): Errors {
  const digits = p.cardNumber.replace(/\D/g, "");
  return {
    cardName: p.cardName.trim() ? undefined : "Enter the name on the card.",
    cardNumber: digits.length >= 13 && digits.length <= 19 ? undefined : "Enter the full card number.",
    expiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(p.expiry.replace(/\s/g, "")) ? undefined : "Use MM/YY, like 04/28.",
    cvc: /^\d{3,4}$/.test(p.cvc.trim()) ? undefined : "Enter the 3 or 4 digit code.",
  };
}

const hasErrors = (e: Errors) => Object.values(e).some(Boolean);

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string };

function Field({ id, label, error, ...input }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className="h-10 rounded-md border border-ink/15 bg-surface px-3 text-md text-ink"
        {...input}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState(emptyShipping);
  const [payment, setPayment] = useState(emptyPayment);
  const [errors, setErrors] = useState<Errors>({});
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressStatus, setAddressStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const started = JSON.stringify(shipping) !== JSON.stringify(emptyShipping);

  useEffect(() => {
    if (!started) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [started]);

  useEffect(() => {
    if (!addressStatus?.ok) return;
    const timer = setTimeout(() => setAddressStatus(null), 1000);
    return () => clearTimeout(timer);
  }, [addressStatus]);

  function editShipping(key: keyof Shipping, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function editPayment(key: keyof Payment, value: string) {
    setPayment((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function saveAddress() {
    setSavingAddress(true);
    setAddressStatus(null);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipping),
      });
      if (!res.ok) throw new Error(String(res.status));
      setAddressStatus({ ok: true, text: "Address saved to your account" });
    } catch {
      setAddressStatus({ ok: false, text: "We couldn't save the address. You can still continue." });
    } finally {
      setSavingAddress(false);
    }
  }

  async function placeOrder() {
    setPlacing(true);
    setOrderError(null);
    setToast(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping, payment: { ...payment, cardNumber: payment.cardNumber.replace(/\D/g, "") } }),
      });
      if (res.status === 402) {
        const message = "Your card was declined. Check the details or use a different card.";
        setToast(message);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const order: { id: string } = await res.json();
      router.replace(`/orders/${order.id}`);
    } catch {
      setOrderError("We couldn't place your order. You haven't been charged. Try again.");
    } finally {
      setPlacing(false);
    }
  }

  function next(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 2) {
      if (!placing) placeOrder();
      return;
    }
    const found = step === 0 ? validateShipping(shipping) : validatePayment(payment);
    setErrors(found);
    if (hasErrors(found)) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStep(step + 1);
  }

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <main className="mx-auto max-w-lg px-4 pt-10">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <ol aria-label="Checkout progress" className="mt-4 flex gap-4 text-sm">
          {steps.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined} className={i === step ? "text-ink underline underline-offset-4" : "text-ink-muted"}>
              {i + 1}. {label}
            </li>
          ))}
        </ol>
        <p className="mt-1 text-sm text-ink-muted">Step {step + 1} of 3</p>

        {orderError && (
          <div role="alert" className="mt-6 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {orderError}
          </div>
        )}

        <form id="checkout-step" ref={formRef} onSubmit={next} noValidate className="mt-6 flex flex-col gap-4">
          {step === 0 && (
            <>
              <Field id="ship-name" label="Full name" autoComplete="shipping name" value={shipping.name} error={errors.name}
                onChange={(e) => editShipping("name", e.target.value)} />
              <Field id="ship-line1" label="Street address" autoComplete="shipping address-line1" value={shipping.line1} error={errors.line1}
                onChange={(e) => editShipping("line1", e.target.value)} />
              <Field id="ship-city" label="City" autoComplete="shipping address-level2" value={shipping.city} error={errors.city}
                onChange={(e) => editShipping("city", e.target.value)} />
              <Field id="ship-postal" label="Postal code" autoComplete="shipping postal-code" spellCheck={false} autoCorrect="off"
                value={shipping.postal} error={errors.postal} onChange={(e) => editShipping("postal", e.target.value)} />
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" disabled={savingAddress} onClick={saveAddress}>
                  {savingAddress ? "Saving address…" : "Save address to my account"}
                </Button>
                {addressStatus && (
                  <p role={addressStatus.ok ? "status" : "alert"} className={`text-sm ${addressStatus.ok ? "text-success" : "text-red-700"}`}>
                    {addressStatus.text}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field id="card-name" label="Name on card" autoComplete="cc-name" autoFocus value={payment.cardName} error={errors.cardName}
                onChange={(e) => editPayment("cardName", e.target.value)} />
              <Field id="card-number" label="Card number" autoComplete="cc-number" inputMode="numeric" spellCheck={false} autoCorrect="off"
                value={payment.cardNumber} error={errors.cardNumber} onChange={(e) => editPayment("cardNumber", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Field id="card-expiry" label="Expiry (MM/YY)" autoComplete="cc-exp" inputMode="numeric" value={payment.expiry}
                  error={errors.expiry} onChange={(e) => editPayment("expiry", e.target.value)} />
                <Field id="card-cvc" label="Security code" autoComplete="cc-csc" inputMode="numeric" value={payment.cvc}
                  error={errors.cvc} onChange={(e) => editPayment("cvc", e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-md">
              <dt className="text-ink-muted">Ship to</dt>
              <dd>{shipping.name}, {shipping.line1}, {shipping.city} {shipping.postal}</dd>
              <dt className="text-ink-muted">Card</dt>
              <dd>Ending in {payment.cardNumber.replace(/\D/g, "").slice(-4)}</dd>
              <dt className="text-ink-muted">Total</dt>
              <dd>$148.00</dd>
            </dl>
          )}
        </form>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink/10 bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-lg justify-between">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => {
              if (step === 1) setShipping(emptyShipping);
              if (step === 2) setPayment(emptyPayment);
              setStep(step - 1);
            }}
          >
            Back
          </Button>
          <Button type="submit" form="checkout-step" disabled={placing}>
            {step === 2 ? (placing ? "Placing order…" : "Place order") : "Continue"}
          </Button>
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-20 right-4 flex w-80 items-center gap-3 rounded-md bg-ink px-4 py-3 text-sm text-surface shadow-lg">
          <span className="flex-1">{toast}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)} className="px-1">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
