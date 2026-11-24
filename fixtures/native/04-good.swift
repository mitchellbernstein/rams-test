import SwiftUI

struct Episode: Identifiable, Equatable {
    let id: UUID
    let title: String
    let show: String
}

struct PlayerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @ScaledMetric(relativeTo: .caption) private var liveDotSize: CGFloat = 8

    @State private var pulse = false
    @State private var speed: Double = 1.0
    @State private var progress: Double = 0.3
    @State private var upNext: [Episode]

    private let speeds: [Double] = [1.0, 1.5, 2.0]

    init(upNext: [Episode]) {
        _upNext = State(initialValue: upNext)
    }

    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text("Now playing")
                    .font(.headline)
                    .accessibilityAddTraits(.isHeader)
                Spacer()
                Button(action: share) {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
                .labelStyle(.iconOnly)
                .frame(minWidth: 44, minHeight: 44)
                Button(action: { dismiss() }) {
                    Image(systemName: "xmark")
                        .frame(width: 44, height: 44)
                        .contentShape(Rectangle())
                }
                .accessibilityLabel("Close")
            }

            HStack {
                Circle()
                    .fill(.red)
                    .frame(width: liveDotSize, height: liveDotSize)
                    .scaleEffect(pulse && !reduceMotion ? 1.4 : 1)
                    .animation(reduceMotion ? nil : .easeInOut(duration: 1).repeatForever(), value: pulse)
                    .accessibilityHidden(true)
                Text("Live")
                    .font(.caption.bold())
            }
            .onAppear { pulse = true }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(.quaternary)
                    Capsule().fill(.tint).frame(width: geo.size.width * progress)
                }
                .frame(height: 6)
                .frame(maxHeight: .infinity)
                .contentShape(Rectangle())
                .gesture(DragGesture(minimumDistance: 0).onChanged { value in
                    progress = min(max(value.location.x / geo.size.width, 0), 1)
                })
            }
            .frame(height: 44)
            .accessibilityElement()
            .accessibilityLabel("Playback position")
            .accessibilityValue("\(Int(progress * 100)) percent")
            .accessibilityAdjustableAction { direction in
                switch direction {
                case .increment: progress = min(progress + 0.05, 1)
                case .decrement: progress = max(progress - 0.05, 0)
                default: break
                }
            }

            HStack {
                ForEach(speeds, id: \.self) { value in
                    Button(String(format: "%.1fx", value)) { speed = value }
                        .padding(.horizontal)
                        .frame(minHeight: 44)
                        .background(speed == value ? Color.accentColor.opacity(0.2) : Color.clear, in: Capsule())
                        .accessibilityAddTraits(speed == value ? .isSelected : [])
                }
            }

            Text("Up next")
                .font(.title3.bold())
                .accessibilityAddTraits(.isHeader)
            ForEach(upNext) { episode in
                VStack(alignment: .leading) {
                    Text(episode.title)
                        .font(.body)
                    Text(episode.show)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .contentShape(Rectangle())
                .accessibilityElement(children: .combine)
                .onLongPressGesture { remove(episode) }
                .accessibilityAction(named: "Remove from Up Next") { remove(episode) }
            }
        }
        .padding()
    }

    private func share() {}

    private func remove(_ episode: Episode) {
        upNext.removeAll { $0 == episode }
    }
}
