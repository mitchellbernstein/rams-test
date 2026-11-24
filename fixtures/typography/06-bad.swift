import SwiftUI

struct ReleaseRow: View {
    let title: String
    let summary: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 17, weight: .semibold))
            Text(summary)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
