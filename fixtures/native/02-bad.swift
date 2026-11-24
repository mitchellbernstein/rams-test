import SwiftUI

@main
struct NotesApp: App {
    @AppStorage("appearance") private var appearance: Appearance = .system

    var body: some Scene {
        WindowGroup {
            SettingsView()
                .preferredColorScheme(.light)
        }
    }
}

enum Appearance: String {
    case system, light, dark

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}

struct SettingsView: View {
    @AppStorage("appearance") private var appearance: Appearance = .system
    @State private var syncEnabled = true

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                VStack(alignment: .leading) {
                    Text("Pro plan")
                        .font(.headline)
                    Text("Renews on March 3")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.accentColor.opacity(0.15))
                .ignoresSafeArea(edges: .top)

                Form {
                    Section {
                        NavigationLink {
                            EditProfileView()
                        } label: {
                            Label("Edit profile", systemImage: "person.crop.circle")
                        }
                        Toggle("Sync across devices", isOn: $syncEnabled)
                        Picker("Appearance", selection: $appearance) {
                            Text("System").tag(Appearance.system)
                            Text("Light").tag(Appearance.light)
                            Text("Dark").tag(Appearance.dark)
                        }
                    }

                    Section {
                        VStack(alignment: .leading) {
                            Text("Signed in")
                                .font(.title3.bold())
                            Text("dana@acme.co")
                                .foregroundColor(.black)
                        }
                        Text("Sign out")
                            .foregroundStyle(.red)
                            .onTapGesture { signOut() }
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }

    private func signOut() {}
}

struct EditProfileView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = "Dana Whitfield"

    var body: some View {
        Form {
            TextField("Display name", text: $name)
            Button("Save") {
                save()
                dismiss()
            }
        }
        .navigationTitle("Edit profile")
        .navigationBarBackButtonHidden(true)
    }

    private func save() {}
}
