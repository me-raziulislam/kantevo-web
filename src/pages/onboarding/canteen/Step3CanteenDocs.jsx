// Step3CanteenDocs.jsx
// Premium canteen documents & banking step

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    DocumentTextIcon,
    BuildingLibraryIcon,
    CheckCircleIcon,
    CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const Step3CanteenDocs = () => {
    const { api, user, saveOnboardingProgress } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    // Form State
    const [panNumber, setPanNumber] = useState(user?.panNumber || "");
    const [registeredBusinessAddress, setAddress] = useState(user?.registeredBusinessAddress || "");
    const [gstRegistered, setGstRegistered] = useState(user?.canteen?.gstRegistered || false);
    const [gstNumber, setGstNumber] = useState(user?.canteen?.gstNumber || "");
    const [fssaiNumber, setFssaiNumber] = useState(user?.canteen?.fssaiNumber || "");
    const [fssaiExpiry, setFssaiExpiry] = useState(
        user?.canteen?.fssaiExpiry ? user.canteen.fssaiExpiry.slice(0, 10) : ""
    );
    const [bankAccountNumber, setBankAccountNumber] = useState(user?.bankAccountNumber || "");
    const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState("");
    const [bankIFSC, setBankIFSC] = useState(user?.bankIFSC || "");
    const [bankAccountType, setBankAccountType] = useState(user?.bankAccountType || "Savings");

    // File Uploads
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

    // Validation
    const [errors, setErrors] = useState({});
    const validPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);
    const validIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIFSC);
    const validBank = bankAccountNumber && confirmBankAccountNumber === bankAccountNumber && validIFSC;
    const validFSSAI = fssaiNumber.trim() && fssaiExpiry.trim() && fssaiCertificate;
    const validGST = !gstRegistered || (gstRegistered && gstNumber.trim() && gstCertificate);

    const canSubmit = validPAN && registeredBusinessAddress.trim() && validGST && validFSSAI && validBank && panDocument;

    useEffect(() => {
        const newErrors = {};
        if (!panNumber.trim()) newErrors.panNumber = "PAN number is required";
        else if (!validPAN) newErrors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
        if (!panDocument) newErrors.panDocument = "PAN document upload is required";
        if (!registeredBusinessAddress.trim()) newErrors.address = "Registered business address is required";
        if (gstRegistered) {
            if (!gstNumber.trim()) newErrors.gstNumber = "GST number is required";
            if (!gstCertificate) newErrors.gstCertificate = "GST certificate upload is required";
        }
        if (!fssaiNumber.trim() || !fssaiExpiry.trim()) newErrors.fssai = "FSSAI number and expiry date are required";
        if (!fssaiCertificate) newErrors.fssaiCertificate = "FSSAI certificate upload is required";
        if (bankAccountNumber && confirmBankAccountNumber && confirmBankAccountNumber !== bankAccountNumber)
            newErrors.bank = "Account numbers do not match";
        if (!bankAccountNumber.trim()) newErrors.bankAccountNumber = "Bank account number is required";
        if (!confirmBankAccountNumber.trim()) newErrors.confirmBankAccountNumber = "Please re-enter bank account number";
        if (!bankIFSC.trim()) newErrors.ifsc = "IFSC code is required";
        else if (!validIFSC) newErrors.ifsc = "Invalid IFSC code (e.g. HDFC0123456)";

        setErrors(newErrors);
        setFormValidity((prev) => ({ ...prev, step3: canSubmit }));
    }, [panNumber, validPAN, panDocument, registeredBusinessAddress, gstRegistered, gstNumber, gstCertificate, fssaiNumber, fssaiExpiry, fssaiCertificate, bankAccountNumber, confirmBankAccountNumber, bankIFSC, validIFSC, canSubmit, setFormValidity]);

    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!canSubmit) {
                toast.error("Please fill all required details correctly.");
                return false;
            }
            try {
                const textPayload = {
                    step: 3,
                    panNumber,
                    registeredBusinessAddress,
                    gstRegistered,
                    gstNumber,
                    fssaiNumber,
                    fssaiExpiry,
                    bankAccountNumber,
                    bankIFSC,
                    bankAccountType,
                };
                await api.put("/canteen/onboarding", { step: 3, ...textPayload, completed: false });

                const filesForm = new FormData();
                let hasFiles = false;
                if (panDocument) { filesForm.append("panDocument", panDocument); hasFiles = true; }
                if (fssaiCertificate) { filesForm.append("fssaiCertificate", fssaiCertificate); hasFiles = true; }
                if (gstCertificate) { filesForm.append("gstCertificate", gstCertificate); hasFiles = true; }

                if (hasFiles) {
                    await api.put("/canteen/onboarding/documents", filesForm, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }

                toast.success("Documents saved successfully!");
                return true;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to upload documents");
                return false;
            }
        });
    }, [canSubmit, panNumber, registeredBusinessAddress, gstRegistered, gstNumber, fssaiNumber, fssaiExpiry, bankAccountNumber, bankIFSC, bankAccountType, panDocument, fssaiCertificate, gstCertificate, api, saveOnboardingProgress, setHandleStepNext]);

    const FileUploadBox = ({ label, file, onChange, error, accept = ".jpg,.jpeg,.png,.pdf" }) => (
        <div>
            <label className="block text-sm text-text-muted mb-2">{label}</label>
            <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${error ? "border-error/50 bg-error/5" : file ? "border-success/50 bg-success/5" : "border-border hover:border-primary/50"}`}>
                <input
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1 text-text-muted">
                        <CloudArrowUpIcon className="w-8 h-8" />
                        <span className="text-sm">Click to upload</span>
                        <span className="text-xs">Max 5MB (JPG, PNG, PDF)</span>
                    </div>
                )}
            </div>
            {error && <p className="text-error text-sm mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Documents & Banking</h2>
                <p className="text-text-secondary">
                    Upload your legal documents and bank details for verification.
                </p>
            </div>

            {/* PAN Section */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-primary" />
                    PAN Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">PAN Number <span className="text-error">*</span></label>
                        <input
                            className={`input uppercase ${errors.panNumber ? "border-error" : ""}`}
                            placeholder="ABCDE1234F"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
                            maxLength={10}
                        />
                        {errors.panNumber && <p className="text-error text-sm mt-1">{errors.panNumber}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Business Address <span className="text-error">*</span></label>
                        <input
                            className={`input ${errors.address ? "border-error" : ""}`}
                            placeholder="Full address of registered business"
                            value={registeredBusinessAddress}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                    </div>
                </div>
                <FileUploadBox
                    label="Upload PAN Card *"
                    file={panDocument}
                    onChange={handleFileChange(setPanDocument)}
                    error={errors.panDocument}
                />
            </div>

            {/* GST Section */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4">GST Details</h3>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gst" checked={gstRegistered} onChange={() => setGstRegistered(true)} className="w-4 h-4 text-primary" />
                        <span className="text-sm">GST Registered</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gst" checked={!gstRegistered} onChange={() => setGstRegistered(false)} className="w-4 h-4 text-primary" />
                        <span className="text-sm">Not Registered</span>
                    </label>
                </div>
                {gstRegistered && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-muted mb-2">GST Number <span className="text-error">*</span></label>
                            <input
                                className={`input uppercase ${errors.gstNumber ? "border-error" : ""}`}
                                placeholder="Enter GST number"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            />
                            {errors.gstNumber && <p className="text-error text-sm mt-1">{errors.gstNumber}</p>}
                        </div>
                        <FileUploadBox
                            label="Upload GST Certificate *"
                            file={gstCertificate}
                            onChange={handleFileChange(setGstCertificate)}
                            error={errors.gstCertificate}
                        />
                    </div>
                )}
            </div>

            {/* FSSAI Section */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4">FSSAI Details</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">FSSAI Number <span className="text-error">*</span></label>
                        <input
                            className={`input ${errors.fssai ? "border-error" : ""}`}
                            placeholder="Enter FSSAI number"
                            value={fssaiNumber}
                            onChange={(e) => setFssaiNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Expiry Date <span className="text-error">*</span></label>
                        <input
                            type="date"
                            className={`input ${errors.fssai ? "border-error" : ""}`}
                            value={fssaiExpiry}
                            onChange={(e) => setFssaiExpiry(e.target.value)}
                        />
                    </div>
                </div>
                {errors.fssai && <p className="text-error text-sm mb-4">{errors.fssai}</p>}
                <FileUploadBox
                    label="Upload FSSAI Certificate *"
                    file={fssaiCertificate}
                    onChange={handleFileChange(setFssaiCertificate)}
                    error={errors.fssaiCertificate}
                />
            </div>

            {/* Bank Section */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BuildingLibraryIcon className="w-5 h-5 text-accent" />
                    Bank Account Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Account Number <span className="text-error">*</span></label>
                        <input
                            className={`input ${errors.bankAccountNumber ? "border-error" : ""}`}
                            placeholder="Enter account number"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                        />
                        {errors.bankAccountNumber && <p className="text-error text-sm mt-1">{errors.bankAccountNumber}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Re-enter Account Number <span className="text-error">*</span></label>
                        <input
                            className={`input ${errors.confirmBankAccountNumber || errors.bank ? "border-error" : ""}`}
                            placeholder="Re-enter account number"
                            value={confirmBankAccountNumber}
                            onChange={(e) => setConfirmBankAccountNumber(e.target.value)}
                        />
                        {(errors.confirmBankAccountNumber || errors.bank) && <p className="text-error text-sm mt-1">{errors.confirmBankAccountNumber || errors.bank}</p>}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">IFSC Code <span className="text-error">*</span></label>
                        <input
                            className={`input uppercase ${errors.ifsc ? "border-error" : ""}`}
                            placeholder="HDFC0123456"
                            value={bankIFSC}
                            onChange={(e) => setBankIFSC(e.target.value.toUpperCase())}
                        />
                        {errors.ifsc && <p className="text-error text-sm mt-1">{errors.ifsc}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Account Type</label>
                        <select
                            className="input"
                            value={bankAccountType}
                            onChange={(e) => setBankAccountType(e.target.value)}
                        >
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-text-secondary">
                    <span className="font-medium text-primary">Important:</span>{" "}
                    All documents will be verified within 24-48 hours. You'll be notified once approved.
                </p>
            </div>
        </div>
    );
};

export default Step3CanteenDocs;
