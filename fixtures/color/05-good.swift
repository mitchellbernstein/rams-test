import SwiftUI

struct InvoiceRow: View {
    let client: String
    let amount: String
    let isPaid: Bool

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(client)
                    .font(.headline)
                    .foregroundStyle(Color("Ink"))
                Text(amount)
                    .font(.subheadline)
                    .foregroundStyle(Color("InkMuted"))
            }
            Spacer()
            Text(isPaid ? "Paid" : "Due")
                .font(.caption.weight(.semibold))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .foregroundStyle(Color("BrandInk"))
                .background(isPaid ? Color("Success") : Color("Brand"), in: RoundedRectangle(cornerRadius: 6))
        }
        .padding(16)
        .background(Color("SurfaceRaised"), in: RoundedRectangle(cornerRadius: 12))
    }
}

struct InvoiceListView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                InvoiceRow(client: "Northwind Studio", amount: "$1,240.00", isPaid: true)
                InvoiceRow(client: "Lumen Bakery", amount: "$380.00", isPaid: false)
                InvoiceRow(client: "Harbor & Co", amount: "$2,015.50", isPaid: true)
            }
            .padding(16)
        }
        .background(Color("Surface"))
        .navigationTitle("Invoices")
    }
}
