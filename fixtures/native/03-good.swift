import SwiftUI

struct Order: Identifiable {
    let id: UUID
    let title: String
    let price: String
    let date: String
    let thumbnail: String
}

struct OrdersView: View {
    let orders: [Order]
    @ScaledMetric(relativeTo: .title2) private var avatarSize: CGFloat = 32

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading) {
                    HStack {
                        Image(decorative: "avatar")
                            .resizable()
                            .scaledToFill()
                            .frame(width: avatarSize, height: avatarSize)
                            .clipShape(Circle())
                        Text("Hi, Dana")
                            .font(.title2.bold())
                            .accessibilityAddTraits(.isHeader)
                    }

                    ViewThatFits {
                        HStack {
                            Image(systemName: "shippingbox")
                                .accessibilityHidden(true)
                            Text("Your next delivery arrives Thursday")
                        }
                        VStack(alignment: .leading) {
                            Image(systemName: "shippingbox")
                                .accessibilityHidden(true)
                            Text("Your next delivery arrives Thursday")
                        }
                    }
                    .frame(minHeight: 44)

                    Label("Free returns for 30 days", systemImage: "arrow.uturn.backward.circle")
                        .foregroundStyle(.secondary)

                    Text("Spending")
                        .font(.title3.bold())
                        .accessibilityAddTraits(.isHeader)
                    Image("orders-chart")
                        .resizable()
                        .scaledToFit()
                        .accessibilityLabel("Monthly spending, down 8 percent since August")

                    Text("Recent purchases")
                        .font(.title3.bold())
                        .accessibilityAddTraits(.isHeader)
                    ForEach(orders) { order in
                        OrderRow(order: order)
                    }

                    NavigationLink {
                        AllOrdersView()
                    } label: {
                        HStack {
                            Text("All orders")
                            Spacer()
                            Image(systemName: "chevron.forward")
                                .accessibilityHidden(true)
                        }
                        .frame(minHeight: 44)
                    }
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Orders")
        }
    }
}

struct OrderRow: View {
    let order: Order
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @ScaledMetric(relativeTo: .body) private var thumbSize: CGFloat = 56

    var body: some View {
        let layout = dynamicTypeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading))
            : AnyLayout(HStackLayout())
        layout {
            Image(decorative: order.thumbnail)
                .resizable()
                .scaledToFill()
                .frame(width: thumbSize, height: thumbSize)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            VStack(alignment: .leading) {
                Text(order.title)
                    .font(.headline)
                Text(order.price)
                    .font(.subheadline)
                Text(order.date)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer()
        }
        .padding()
        .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 12))
        .accessibilityElement(children: .combine)
    }
}

struct AllOrdersView: View {
    var body: some View {
        Text("All orders")
    }
}
