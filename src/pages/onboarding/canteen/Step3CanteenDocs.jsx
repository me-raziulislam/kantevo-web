// Step3CanteenDocs.jsx
// Canteen Owner Onboarding Step 3: Legal Documents & Bank Details
// Handles PAN, GST, FSSAI, and Bank details with file upload + validation.

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const Step3CanteenDocs = () => {
    const { api, user, saveOnboardingProgress } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    /* -----------------------------
     Form State
    ----------------------------- */
    const [panNumber, setPanNumber] = useState(user?.panNumber || "");
    const [registeredBusinessAddress, setAddress] = useState(
        user?.registeredBusinessAddress || ""
    );
    const [gstRegistered, setGstRegistered] = useState(
        user?.canteen?.gstRegistered || false
    );
    const [gstNumber, setGstNumber] = useState(user?.canteen?.gstNumber || "");
    const [fssaiNumber, setFssaiNumber] = useState(user?.canteen?.fssaiNumber || "");
    const [fssaiExpiry, setFssaiExpiry] = useState(
        user?.canteen?.fssaiExpiry ? user.canteen.fssaiExpiry.slice(0, 10) : ""
    );
    const [bankAccountNumber, setBankAccountNumber] = useState(
        user?.bankAccountNumber || ""
    );
    const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState("");
    const [bankIFSC, setBankIFSC] = useState(user?.bankIFSC || "");
    const [bankAccountType, setBankAccountType] = useState(
        user?.bankAccountType || "Savings"
    );

    /* -----------------------------
     File Uploads
    ----------------------------- */
    const [panDocument, setPanDocument] = useState(null);
    const [fssaiCertificate, setFssaiCertificate] = useState(null);
    const [gstCertificate, setGstCertificate] = useState(null);

    const handleFileChange = (setter) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be below 5 MB");
            return;
        }
        setter(file);
    };

    /* -----------------------------
     Validation Logic
    ----------------------------- */
    const [errors, setErrors] = useState({});

    const validPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);
    const validIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIFSC);
    const validBank =
        bankAccountNumber &&
        confirmBankAccountNumber === bankAccountNumber &&
        validIFSC;
    const validFSSAI =
        fssaiNumber.trim() && fssaiExpiry.trim() && fssaiCertificate;

    // GST required only if gstRegistered = true
    const validGST =
        !gstRegistered ||
        (gstRegistered && gstNumber.trim() && gstCertificate);

    const canSubmit =
        validPAN &&
        registeredBusinessAddress.trim() &&
        validGST &&
        validFSSAI &&
        validBank &&
        panDocument;

    useEffect(() => {
        const newErrors = {};

        if (!panNumber.trim()) newErrors.panNumber = "PAN number is required";
        else if (!validPAN)
            newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";

        if (!panDocument) newErrors.panDocument = "PAN document upload is required";

        if (!registeredBusinessAddress.trim())
            newErrors.address = "Registered business address is required";

        if (gstRegistered) {
            if (!gstNumber.trim()) newErrors.gstNumber = "GST number is required";
            if (!gstCertificate)
                newErrors.gstCertificate = "GST certificate upload is required";
        }

        if (!fssaiNumber.trim() || !fssaiExpiry.trim())
            newErrors.fssai = "FSSAI number and expiry date are required";
        if (!fssaiCertificate)
            newErrors.fssaiCertificate = "FSSAI certificate upload is required";

        if (
            bankAccountNumber &&
            confirmBankAccountNumber &&
            confirmBankAccountNumber !== bankAccountNumber
        )
            newErrors.bank = "Account numbers do not match";
        if (!bankAccountNumber.trim())
            newErrors.bankAccountNumber = "Bank account number is required";
        if (!confirmBankAccountNumber.trim())
            newErrors.confirmBankAccountNumber = "Please re-enter bank account number";
        if (!bankIFSC.trim()) newErrors.ifsc = "IFSC code is required";
        else if (!validIFSC)
            newErrors.ifsc = "Invalid IFSC code (e.g. HDFC0123456)";

        setErrors(newErrors);
        setFormValidity((prev) => ({ ...prev, step3: canSubmit }));
    }, [
        panNumber,
        validPAN,
        panDocument,
        registeredBusinessAddress,
        gstRegistered,
        gstNumber,
        gstCertificate,
        fssaiNumber,
        fssaiExpiry,
        fssaiCertificate,
        bankAccountNumber,
        confirmBankAccountNumber,
        bankIFSC,
        validIFSC,
        canSubmit,
        setFormValidity,
    ]);

    /* -----------------------------
     Submit Handler (TEXT first, FILES second)
    ----------------------------- */
    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!canSubmit) {
                toast.error("Please fill all required details correctly.");
                return false;
            }

            try {
                // 1) TEXT payload -> JSON endpoint
                const textPayload = {
                    step: 3,
                    panNumber: panNumber,
                    registeredBusinessAddress: registeredBusinessAddress,
                    gstRegistered: gstRegistered,
                    gstNumber: gstNumber,
                    fssaiNumber: fssaiNumber,
                    fssaiExpiry: fssaiExpiry, // 'YYYY-MM-DD' string
                    bankAccountNumber: bankAccountNumber,
                    bankIFSC: bankIFSC,
                    bankAccountType: bankAccountType,
                };

                // Use JSON endpoint for text fields
                await api.put("/canteen/onboarding", { step: 3, ...textPayload, completed: false });

                // 2) Files payload -> multipart endpoint (only if any files present)
                const filesForm = new FormData();
                let hasFiles = false;
                if (panDocument) {
                    filesForm.append("panDocument", panDocument);
                    hasFiles = true;
                }
                if (fssaiCertificate) {
                    filesForm.append("fssaiCertificate", fssaiCertificate);
                    hasFiles = true;
                }
                if (gstCertificate) {
                    filesForm.append("gstCertificate", gstCertificate);
                    hasFiles = true;
                }

                if (hasFiles) {
                    await api.put("/canteen/onboarding/documents", filesForm, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }

                toast.success("Documents saved successfully!");
                // keep existing flow: still call saveOnboardingProgress to update local state / server step
                //await saveOnboardingProgress(3, {});
                return true;
            } catch (err) {
                console.error("Step3 save error:", err);
                toast.error(err.response?.data?.message || "Failed to upload documents");
                return false;
            }
        });
    }, [
        canSubmit,
        panNumber,
        registeredBusinessAddress,
        gstRegistered,
        gstNumber,
        fssaiNumber,
        fssaiExpiry,
        bankAccountNumber,
        bankIFSC,
        bankAccountType,
        panDocument,
        fssaiCertificate,
        gstCertificate,
        api,
        saveOnboardingProgress,
        setHandleStepNext,
    ]);

    /* -----------------------------
     UI Rendering
    ----------------------------- */
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-extrabold">Restaurant documents</h2>
            <p className="text-text/70">
                Upload your PAN, GST, FSSAI, and bank details to complete registration.
            </p>

            {/* ---------- PAN Section ---------- */}
            <section className="border rounded-xl p-5 bg-background-card">
                <h3 className="text-lg font-semibold mb-3">PAN details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <input
                            placeholder="PAN number*"
                            className={`w-full p-3 rounded-lg border ${errors.panNumber
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                                }`}
                            value={panNumber}
                            onChange={(e) =>
                                setPanNumber(e.target.value.toUpperCase().slice(0, 10))
                            }
                            maxLength={10}
                        />
                        {errors.panNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
                        )}
                    </div>
                    <div>
                        <input
                            placeholder="Full address of your registered business*"
                            className={`w-full p-3 rounded-lg border ${errors.address
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                                }`}
                            value={registeredBusinessAddress}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm mb-1">
                        Upload your PAN (jpeg/png/pdf up to 5 MB)*
                    </label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange(setPanDocument)}
                        className="w-full p-2 border border-dashed rounded-lg"
                    />
                    {errors.panDocument && (
                        <p className="text-red-500 text-sm mt-1">{errors.panDocument}</p>
                    )}
                    {panDocument && (
                        <p className="text-xs text-green-600 mt-1">
                            Selected: {panDocument.name}
                        </p>
                    )}
                </div>
            </section>

            {/* ---------- GST Section ---------- */}
            <section className="border rounded-xl p-5 bg-background-card">
                <h3 className="text-lg font-semibold mb-3">GST details</h3>
                <div className="flex gap-4 mb-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="gstRegistered"
                            checked={gstRegistered === true}
                            onChange={() => setGstRegistered(true)}
                        />
                        Yes
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="gstRegistered"
                            checked={gstRegistered === false}
                            onChange={() => setGstRegistered(false)}
                        />
                        No
                    </label>
                </div>

                {gstRegistered && (
                    <div className="space-y-3">
                        <input
                            placeholder="GST number*"
                            className={`w-full p-3 rounded-lg border ${errors.gstNumber
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                                }`}
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        />
                        {errors.gstNumber && (
                            <p className="text-red-500 text-sm">{errors.gstNumber}</p>
                        )}
                        <label className="block text-sm mb-1">
                            Upload GST certificate (jpeg/png/pdf up to 5 MB)*
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange(setGstCertificate)}
                            className="w-full p-2 border border-dashed rounded-lg"
                        />
                        {errors.gstCertificate && (
                            <p className="text-red-500 text-sm mt-1">{errors.gstCertificate}</p>
                        )}
                        {gstCertificate && (
                            <p className="text-xs text-green-600 mt-1">
                                Selected: {gstCertificate.name}
                            </p>
                        )}
                    </div>
                )}
            </section>

            {/* ---------- FSSAI Section ---------- */}
            <section className="border rounded-xl p-5 bg-background-card">
                <h3 className="text-lg font-semibold mb-3">FSSAI details</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <input
                        placeholder="FSSAI number*"
                        className={`w-full p-3 rounded-lg border ${errors.fssai ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                        value={fssaiNumber}
                        onChange={(e) => setFssaiNumber(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Expiry date*"
                        className={`w-full p-3 rounded-lg border ${errors.fssai ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                        value={fssaiExpiry}
                        onChange={(e) => setFssaiExpiry(e.target.value)}
                    />
                </div>
                {errors.fssai && <p className="text-red-500 text-sm">{errors.fssai}</p>}

                <label className="block text-sm mb-1 mt-2">
                    Upload FSSAI certificate (jpeg/png/pdf up to 5 MB)*
                </label>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange(setFssaiCertificate)}
                    className="w-full p-2 border border-dashed rounded-lg"
                />
                {errors.fssaiCertificate && (
                    <p className="text-red-500 text-sm mt-1">{errors.fssaiCertificate}</p>
                )}
                {fssaiCertificate && (
                    <p className="text-xs text-green-600 mt-1">
                        Selected: {fssaiCertificate.name}
                    </p>
                )}
            </section>

            {/* ---------- Bank Section ---------- */}
            <section className="border rounded-xl p-5 bg-background-card">
                <h3 className="text-lg font-semibold mb-3">Bank account details</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                        placeholder="Bank account number*"
                        className={`w-full p-3 rounded-lg border ${errors.bankAccountNumber
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                    />
                    <input
                        placeholder="Re-enter bank account number*"
                        className={`w-full p-3 rounded-lg border ${errors.confirmBankAccountNumber
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                        value={confirmBankAccountNumber}
                        onChange={(e) => setConfirmBankAccountNumber(e.target.value)}
                    />
                </div>
                {errors.bank && <p className="text-red-500 text-sm mb-2">{errors.bank}</p>}

                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        placeholder="IFSC code*"
                        className={`w-full p-3 rounded-lg border uppercase ${errors.ifsc ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                        value={bankIFSC}
                        onChange={(e) => setBankIFSC(e.target.value.toUpperCase())}
                    />
                    <select
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                        value={bankAccountType}
                        onChange={(e) => setBankAccountType(e.target.value)}
                    >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                    </select>
                </div>
                {errors.ifsc && <p className="text-red-500 text-sm mt-2">{errors.ifsc}</p>}
            </section>
        </div>
    );
};

export default Step3CanteenDocs;
