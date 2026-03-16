const fs = require('fs');
const path = '/Users/mirkodgz/Projects/criss-dell-orto/beautify-channel/src/components/draft2026/UpgradeCheckoutForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// Require Signature regardless of plan
content = content.replace(
    /if \(selectedPlan === "premium"\) \{\n            const signatureDataUrl/g,
    '// Firma richiesta per entrambi i piani\n        const signatureDataUrl'
).replace(
    /if \(signatureDataUrl\) \{\n                formData\.append\("signatureBase64", signatureDataUrl\);\n            \}\n        \}/g,
    'if (signatureDataUrl && !sigCanvas.current?.isEmpty()) {\n            formData.append("signatureBase64", signatureDataUrl);\n        } else {\n            setStatus({ type: "error", message: "Per favore, inserisci la tua firma prima di procedere." });\n            setIsSubmitting(false);\n            return;\n        }'
);

// Show Step 3 indicator for both plans
content = content.replace(
    '{selectedPlan === "premium" && (',
    '{true && (' // Keep bracket structure but make always true
);
content = content.replace(
    '/* STEP 3: Firma Elettronica (SOLO PREMIUM) */',
    '/* STEP 3: Firma Elettronica (Entrambi i piani) */'
);

// Step 3 button transition
const oldBtn = `{selectedPlan === "premium" ? (
                                        <Button type="button" onClick={handleNextStep2} className={\`bg-gradient-to-r \${themeColors.btnGradientFrom} \${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all border-none flex-1 md:flex-none text-lg\`}>
                                            Vai allo Step 3 (Firma) &rarr;
                                        </Button>
                                    ) : (
                                        <Button type="submit" disabled={isSubmitting} onClick={(e) => { if (!validateStep2()) { e.preventDefault(); } }} className={\`bg-gradient-to-r \${themeColors.btnGradientFrom} \${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all disabled:opacity-50 border-none flex-1 md:flex-none text-lg\`}>
                                            {isSubmitting ? "Invio in corso..." : "Procedi al Pagamento Sicuro"}
                                        </Button>
                                    )}`;

const newBtn = `<Button type="button" onClick={handleNextStep2} className={\`bg-gradient-to-r \${themeColors.btnGradientFrom} \${themeColors.btnGradientTo} text-white font-bold py-6 px-10 rounded-xl transition-all border-none flex-1 md:flex-none text-lg\`}>
                                        Vai allo Step 3 (Firma) &rarr;
                                    </Button>`;

content = content.replace(oldBtn, newBtn);

// Stepper lines
content = content.replace(
    '{selectedPlan === "premium" ? "grid-cols-3" : "grid-cols-2"}',
    '"grid-cols-3"'
).replace(
    '{selectedPlan === "premium" && "1/3"}',
    '"1/3"'
).replace(
    '{selectedPlan === "premium" ? "2/3" : "1/2"}',
    '"2/3"'
).replace(
    '{selectedPlan === "premium" && (',
    '{true && ('
);

fs.writeFileSync(path, content, 'utf8');
console.log('UpgradeCheckoutForm.tsx updated to support global signatures');
