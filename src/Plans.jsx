import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateSubscriptionMutation } from "./apis/subscriptionApi";

const PLAN_CATALOG = {
  monthly: [
    {
      id: "plan_T4wmQjED9Pmc5M",
      name: "Starter",
      tagline: "For personal storage",
      storage: "500 MB",
      price: 19,
      period: "/mo",
      cta: "Choose Starter",
      features: ["500 MB cloud storage", "Secure file upload", "File sharing"],
      popular: false,
    },
    {
      id: "plan_T4wnHOVroQPyZA",
      name: "Pro",
      tagline: "For more storage needs",
      storage: "2 GB",
      price: 49,
      period: "/mo",
      cta: "Choose Pro",
      features: ["2 GB cloud storage", "Secure file upload", "File sharing"],
      popular: true,
    },
  ],

  yearly: [
    {
      id: "plan_T4wtL2ZZ61pN10",
      name: "Starter",
      tagline: "Yearly storage plan",
      storage: "500 MB",
      price: 199,
      period: "/yr",
      cta: "Choose Starter",
      features: ["500 MB cloud storage", "Secure file upload", "File sharing"],
      popular: false,
    },
    {
      id: "plan_T4ws4Ajz45xKH6",
      name: "Pro",
      tagline: "Best value storage plan",
      storage: "2 GB",
      price: 499,
      period: "/yr",
      cta: "Choose Pro",
      features: ["2 GB cloud storage", "Secure file upload", "File sharing"],
      popular: true,
    },
  ],
};
function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

function Price({ value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-semibold text-slate-700">₹</span>
      <span className="text-4xl font-bold tracking-tight text-slate-900">
        {value}
      </span>
    </div>
  );
}

function PlanCard({ plan, onSelect }) {
  return (
    <div
      className={classNames(
        "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition",
        "hover:shadow-md",
        plan.popular
          ? "border-blue-500/60 ring-1 ring-blue-500/20"
          : "border-slate-200",
      )}
    >
      {plan.popular && (
        <div className="absolute -top-2 right-4 select-none rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white shadow">
          Most Popular
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500">{plan.tagline}</p>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
          {plan.storage}
        </span>
      </div>

      <div className="mb-4 flex items-end gap-2">
        <Price value={plan.price} />
        <span className="mb-[6px] text-sm text-slate-500">{plan.period}</span>
      </div>

      <ul className="mb-5 space-y-2 text-sm text-slate-600">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-none"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect?.(plan)}
        className={classNames(
          "mt-auto cursor-pointer inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2",
          plan.popular
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600"
            : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
        )}
      >
        {plan.cta}
      </button>
    </div>
  );
}

export default function Plans() {
  const [mode, setMode] = useState("monthly");
  const plans = PLAN_CATALOG[mode];
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const navigate = useNavigate();
  async function handleSelect(plan) {
    console.log(plan);
    try {
      const data = await createSubscription(plan.id).unwrap();
      console.log(data);
      openRazorpayPopup(data, navigate);
    } catch (error) {
      alert(error?.data?.message || "Unable to create subscription");
    }
  }

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) {
      console.log("NO razorpayscript");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Choose your plan
        </h1>
        <Link to="/">Home</Link>
      </header>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
        <button
          onClick={() => setMode("monthly")}
          className={classNames(
            "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
            mode === "monthly" ? "border-blue-500" : "border-white",
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setMode("yearly")}
          className={classNames(
            "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
            mode === "yearly" ? "border-blue-500" : "border-white",
          )}
        >
          Yearly{" "}
          <span className="ml-1 hidden text-xs text-blue-600 sm:inline">
            (2 months off)
          </span>
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={`${mode}-${plan.id}`}
            plan={plan}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Small helper text */}
      <p className="mt-6 text-xs text-slate-500">
        Prices are indicative for demo. Integrate with Razorpay Subscriptions to
        start billing. You can prefill the plan IDs inside a static config.
      </p>
    </div>
  );
}

function openRazorpayPopup({ subscriptionId }, navigate) {
  const rzp = new window.Razorpay({
    key: "rzp_test_S23Gy7SP1MEQyr",
    name: "Storage App",

    subscription_id: subscriptionId,
    handler: async function (response) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    },
  });
  rzp.on("payment.failed", function (response) {
    console.log(response);
  });

  rzp.open();
}
