import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      badge: "Starter Plan",
      price: "Free",
      highlight: "green",
      features: [
        "500 MB secure storage",
        "100 MB upload per file",
        "Access from 1 device",
        "Standard download speed",
        "Basic email support",
      ],
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: "₹299 / month",
      highlight: "blue",
      features: [
        "200 GB secure storage",
        "2 GB upload per file",
        "Access up to 3 devices",
        "Priority upload/download",
        "Email & chat support",
      ],
    },
    {
      name: "Premium",
      badge: "Enterprise",
      price: "₹699 / month",
      highlight: "slate",
      features: [
        "2 TB secure storage",
        "10 GB upload per file",
        "Access up to 3 devices",
        "Priority speed",
        "Priority support",
      ],
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm"
            >
              {plan.badge && (
                <span
                  className={`inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full ${
                    plan.highlight === "green"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>

              <button
                className={`w-full py-3 rounded-md font-medium transition-colors ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>

              <ul className="mt-8 space-y-3 text-slate-600 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
