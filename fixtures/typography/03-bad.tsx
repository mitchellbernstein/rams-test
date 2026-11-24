type Invoice = {
  id: string;
  paymentId: string;
  customerEmail: string;
  issuedAt: string;
  total: number;
  currency: string;
  pdfName: string;
  pdfBytes: number;
};

interface InvoicesProps {
  invoices: Invoice[];
  locale: string;
  currency: string;
  seatCount: number;
  storageGb: number;
  balanceDue: number;
}

const formatMoney = (amount: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const formatDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));

export default function Invoices({ invoices, locale, currency, seatCount, storageGb, balanceDue }: InvoicesProps) {
  return (
    <section className="p-8 text-ink">
      <h1 className="text-xl font-semibold leading-tight text-balance">Invoices</h1>
      <p className="mt-2 max-w-prose text-sm text-pretty text-ink-muted">Invoices are emailed within 1-2 business days of each charge.</p>

      <dl className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <dt className="text-sm text-ink-muted">Seats</dt>
          <dd className="mt-1 text-lg font-semibold">{seatCount.toLocaleString(locale)}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Storage</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">{storageGb.toLocaleString(locale, { maximumFractionDigits: 1 })} GB</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Balance due</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">{"$" + balanceDue.toFixed(2)}</dd>
        </div>
      </dl>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="text-ink-muted">
            <th scope="col" className="py-2 text-left font-medium">Payment ID</th>
            <th scope="col" className="py-2 text-left font-medium">Customer</th>
            <th scope="col" className="py-2 text-left font-medium">Issued</th>
            <th scope="col" className="py-2 text-right font-medium">Amount</th>
            <th scope="col" className="py-2 text-left font-medium">Attachment</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t border-ink/10">
              <td className="py-3">{invoice.paymentId}</td>
              <td className="max-w-48 py-3">{invoice.customerEmail}</td>
              <td className="py-3 tabular-nums">{formatDate(invoice.issuedAt, locale)}</td>
              <td className="py-3 text-left tabular-nums">{formatMoney(invoice.total, invoice.currency, locale)}</td>
              <td className="py-3">
                <div className="flex max-w-56 items-center gap-2">
                  <span className="truncate">{invoice.pdfName}</span>
                  <span className="shrink-0 text-ink-muted tabular-nums">{invoice.pdfBytes}&nbsp;bytes</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
