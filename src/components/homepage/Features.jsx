import { HardDrive, Folder, Shield } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: <HardDrive className="text-blue-600" size={22} />,
      title: "Upload & Manage",
      desc: "Drag and drop files with a clean dashboard interface.",
    },
    {
      icon: <Folder className="text-blue-600" size={22} />,
      title: "Folder Organization",
      desc: "Create nested folders and keep everything structured.",
    },
    {
      icon: <Shield className="text-blue-600" size={22} />,
      title: "Secure Backup",
      desc: "Encryption and safe cloud storage for your data.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-8 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="mb-5">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
