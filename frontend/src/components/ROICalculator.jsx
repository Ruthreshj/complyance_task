import React, { useMemo, useState } from "react";

function NumberInput({ label, fieldKey, example, value, onChange, min = 0, step = 1, suffix, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            outline: "none",
          }}
        />
        {suffix ? (
          <span style={{ color: "#64748b", fontSize: 12, whiteSpace: "nowrap" }}>{suffix}</span>
        ) : null}
      </div>
      <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
        {fieldKey ? (<span>Key: <code style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 4px' }}>{fieldKey}</code></span>) : null}
        {example ? (<span>{fieldKey ? ' • ' : ''}e.g., {example}</span>) : null}
        {hint ? (<span>{(fieldKey || example) ? ' • ' : ''}{hint}</span>) : null}
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [scenarioName, setScenarioName] = useState("Q4_Pilot");
  const [monthlyInvoiceVolume, setMonthlyInvoiceVolume] = useState(2000);
  const [numApStaff, setNumApStaff] = useState(3);
  const [avgHoursPerInvoice, setAvgHoursPerInvoice] = useState(0.17);
  const [hourlyWage, setHourlyWage] = useState(30);
  const [errorRateManualPct, setErrorRateManualPct] = useState(0.5);
  const [errorCost, setErrorCost] = useState(100);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState(36);
  const [oneTimeImplementationCost, setOneTimeImplementationCost] = useState(50000);
  const [softwareMonthlyCost, setSoftwareMonthlyCost] = useState(299);
  const [timeReductionPct, setTimeReductionPct] = useState(70);
  const [errorReductionPct, setErrorReductionPct] = useState(80);

  const results = useMemo(() => {
    const manualHours = monthlyInvoiceVolume * avgHoursPerInvoice;
    const manualLaborCost = manualHours * hourlyWage;
    const manualErrors = monthlyInvoiceVolume * (errorRateManualPct / 100);
    const manualErrorCostTotal = manualErrors * errorCost;
    const manualTotalMonthly = manualLaborCost + manualErrorCostTotal;

    const automatedHours = monthlyInvoiceVolume * avgHoursPerInvoice * (1 - timeReductionPct / 100);
    const automatedLaborCost = automatedHours * hourlyWage;
    const automatedErrors = manualErrors * (1 - errorReductionPct / 100);
    const automatedErrorCostTotal = automatedErrors * errorCost;
    const automatedTotalMonthly = automatedLaborCost + automatedErrorCostTotal + softwareMonthlyCost;

    const monthlySavings = Math.max(manualTotalMonthly - automatedTotalMonthly, 0);
    const annualSavings = monthlySavings * 12;
    const paybackMonths = monthlySavings > 0
      ? (oneTimeImplementationCost > 0 ? Math.ceil(oneTimeImplementationCost / monthlySavings) : 0)
      : Infinity;

    const horizonNetBenefit = monthlySavings * timeHorizonMonths - oneTimeImplementationCost;
    const cashOutlayHorizon = softwareMonthlyCost * timeHorizonMonths + oneTimeImplementationCost;
    const roiHorizonPct = cashOutlayHorizon > 0 ? (horizonNetBenefit / cashOutlayHorizon) * 100 : 0;

    return {
      manualHours,
      manualLaborCost,
      manualErrorCostTotal,
      manualTotalMonthly,
      automatedHours,
      automatedLaborCost,
      automatedErrorCostTotal,
      automatedTotalMonthly,
      monthlySavings,
      annualSavings,
      paybackMonths,
      horizonNetBenefit,
      roiHorizonPct,
    };
  }, [
    monthlyInvoiceVolume,
    avgHoursPerInvoice,
    hourlyWage,
    softwareMonthlyCost,
    oneTimeImplementationCost,
    errorRateManualPct,
    errorCost,
    timeReductionPct,
    errorReductionPct,
    timeHorizonMonths,
  ]);

  const currency = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const hours = (n) => `${n.toFixed(1)} hrs`;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      }}>
        <div style={{
          background: "linear-gradient(180deg, #ecfeff, #ffffff)",
          border: "1px solid #bae6fd",
          borderRadius: 14,
          padding: 14,
        }}>
          <div style={{ color: "#0369a1", fontSize: 12, fontWeight: 700 }}>Monthly savings</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{currency(results.monthlySavings)}</div>
        </div>
        <div style={{
          background: "linear-gradient(180deg, #f0fdf4, #ffffff)",
          border: "1px solid #bbf7d0",
          borderRadius: 14,
          padding: 14,
        }}>
          <div style={{ color: "#166534", fontSize: 12, fontWeight: 700 }}>Annual savings</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{currency(results.annualSavings)}</div>
        </div>
        <div style={{
          background: "linear-gradient(180deg, #fef9c3, #ffffff)",
          border: "1px solid #fde68a",
          borderRadius: 14,
          padding: 14,
        }}>
          <div style={{ color: "#92400e", fontSize: 12, fontWeight: 700 }}>Payback</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{results.paybackMonths === 0 ? "Immediate" : isFinite(results.paybackMonths) ? `${results.paybackMonths} mo` : "—"}</div>
        </div>
      </section>

      <section style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Inputs</div>
          <div style={{
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            color: "#334155",
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            fontSize: 12,
          }}>
            What to enter (examples):
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>scenario_name: Q4_Pilot</li>
              <li>monthly_invoice_volume: 2000</li>
              <li>num_ap_staff: 3</li>
              <li>avg_hours_per_invoice: 0.17 (10 mins)</li>
              <li>hourly_wage: 30</li>
              <li>error_rate_manual: 0.5 (%)</li>
              <li>error_cost: 100 (USD)</li>
              <li>time_horizon_months: 36</li>
              <li>one_time_implementation_cost: 50000 (USD)</li>
            </ul>
          </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>Scenario name</label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, outline: "none" }}
          />
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Key: <code style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 4px' }}>scenario_name</code> • e.g., Q4_Pilot</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <NumberInput label="Invoices per month" fieldKey="monthly_invoice_volume" example="2000" value={monthlyInvoiceVolume} onChange={setMonthlyInvoiceVolume} min={0} />
          <NumberInput label="AP staff count" fieldKey="num_ap_staff" example="3" value={numApStaff} onChange={setNumApStaff} min={0} />
          <NumberInput label="Avg hours per invoice" fieldKey="avg_hours_per_invoice" example="0.17" value={avgHoursPerInvoice} onChange={setAvgHoursPerInvoice} min={0} step={0.01} suffix="hrs" />
          <NumberInput label="Hourly wage" fieldKey="hourly_wage" example="30" value={hourlyWage} onChange={setHourlyWage} min={0} suffix="USD/hr" />
          <NumberInput label="Manual error rate" fieldKey="error_rate_manual" example="0.5" value={errorRateManualPct} onChange={setErrorRateManualPct} min={0} step={0.1} suffix="%" />
          <NumberInput label="Cost per error" fieldKey="error_cost" example="100" value={errorCost} onChange={setErrorCost} min={0} suffix="USD" />
          <NumberInput label="Time horizon" fieldKey="time_horizon_months" example="36" value={timeHorizonMonths} onChange={setTimeHorizonMonths} min={1} suffix="months" />
          <NumberInput label="One-time implementation cost" fieldKey="one_time_implementation_cost" example="50000" value={oneTimeImplementationCost} onChange={setOneTimeImplementationCost} min={0} suffix="USD" />
        </div>

          <div style={{ marginTop: 8, color: "#0f172a", fontWeight: 600 }}>Assumptions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <NumberInput label="Software subscription (monthly)" fieldKey="software_subscription" example="299" value={softwareMonthlyCost} onChange={setSoftwareMonthlyCost} min={0} suffix="USD/mo" />
            <NumberInput label="Time reduction with automation" fieldKey="time_reduction_with_automation" example="70" value={timeReductionPct} onChange={setTimeReductionPct} min={0} max={100} step={5} suffix="%" />
            <NumberInput label="Error reduction with automation" fieldKey="error_reduction_with_automation" example="80" value={errorReductionPct} onChange={setErrorReductionPct} min={0} max={100} step={5} suffix="%" />
          </div>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Breakdown</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 12,
          }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Manual</div>
              <div style={{ color: "#334155" }}>Time: <strong>{hours(results.manualHours)}</strong></div>
              <div style={{ color: "#334155" }}>Labor: <strong>{currency(results.manualLaborCost)}</strong></div>
              <div style={{ color: "#334155" }}>Errors: <strong>{currency(results.manualErrorCostTotal)}</strong></div>
              <div style={{ marginTop: 4 }}>Total: <strong>{currency(results.manualTotalMonthly)}</strong></div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Automated</div>
              <div style={{ color: "#334155" }}>Time: <strong>{hours(results.automatedHours)}</strong></div>
              <div style={{ color: "#334155" }}>Labor: <strong>{currency(results.automatedLaborCost)}</strong></div>
              <div style={{ color: "#334155" }}>Errors: <strong>{currency(results.automatedErrorCostTotal)}</strong></div>
              <div style={{ color: "#334155" }}>Software: <strong>{currency(softwareMonthlyCost)}</strong></div>
              <div style={{ marginTop: 4 }}>Total: <strong>{currency(results.automatedTotalMonthly)}</strong></div>
            </div>
          </div>
          <div style={{
            background: "#fbfef3",
            border: "1px solid #d9f99d",
            borderRadius: 12,
            padding: 12,
            marginTop: 12,
          }}>
            <div style={{ fontWeight: 700 }}>Your gains</div>
            <div style={{ color: "#166534", marginTop: 4 }}>Monthly savings: <strong>{currency(results.monthlySavings)}</strong></div>
            <div style={{ color: "#166534" }}>Annual savings: <strong>{currency(results.annualSavings)}</strong></div>
            <div style={{ color: "#166534" }}>
              Payback: <strong>{results.paybackMonths === 0 ? "Immediate" : isFinite(results.paybackMonths) ? `${results.paybackMonths} months` : "—"}</strong>
            </div>
            <div style={{ color: "#166534" }}>Horizon net benefit: <strong>{currency(results.horizonNetBenefit)}</strong></div>
            <div style={{ color: "#166534" }}>ROI over horizon: <strong>{`${results.roiHorizonPct.toFixed(0)}%`}</strong></div>
          </div>
        </div>
      </section>

      <hr style={{ border: 0, borderTop: "1px solid #e2e8f0" }} />

      <section style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Results</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 12,
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Manual</div>
            <div style={{ color: "#334155" }}>Time: <strong>{hours(results.manualHours)}</strong></div>
            <div style={{ color: "#334155" }}>Labor: <strong>{currency(results.manualLaborCost)}</strong></div>
            <div style={{ color: "#334155" }}>Errors: <strong>{currency(results.manualErrorCostTotal)}</strong></div>
            <div style={{ marginTop: 4 }}>Total: <strong>{currency(results.manualTotalMonthly)}</strong></div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Automated</div>
            <div style={{ color: "#334155" }}>Time: <strong>{hours(results.automatedHours)}</strong></div>
            <div style={{ color: "#334155" }}>Labor: <strong>{currency(results.automatedLaborCost)}</strong></div>
            <div style={{ color: "#334155" }}>Errors: <strong>{currency(results.automatedErrorCostTotal)}</strong></div>
            <div style={{ color: "#334155" }}>Software: <strong>{currency(softwareMonthlyCost)}</strong></div>
            <div style={{ marginTop: 4 }}>Total: <strong>{currency(results.automatedTotalMonthly)}</strong></div>
          </div>
        </div>

        <div style={{
          background: "#fbfef3",
          border: "1px solid #d9f99d",
          borderRadius: 12,
          padding: 12,
        }}>
          <div style={{ fontWeight: 700 }}>Your gains</div>
          <div style={{ color: "#166534", marginTop: 4 }}>Monthly savings: <strong>{currency(results.monthlySavings)}</strong></div>
          <div style={{ color: "#166534" }}>Annual savings: <strong>{currency(results.annualSavings)}</strong></div>
          <div style={{ color: "#166534" }}>
            Payback: <strong>{results.paybackMonths === 0 ? "Immediate" : isFinite(results.paybackMonths) ? `${results.paybackMonths} months` : "—"}</strong>
          </div>
          <div style={{ color: "#166534" }}>Horizon net benefit: <strong>{currency(results.horizonNetBenefit)}</strong></div>
          <div style={{ color: "#166534" }}>ROI over horizon: <strong>{`${results.roiHorizonPct.toFixed(0)}%`}</strong></div>
        </div>
      </section>

      <div style={{ fontSize: 12, color: "#64748b" }}>
        Assumptions can be tuned. Defaults reflect typical automation gains for invoice processing.
      </div>
    </div>
  );
}


