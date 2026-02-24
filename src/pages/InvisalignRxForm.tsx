import { useEffect, useMemo, useState } from "react";
import {  Calendar, ChevronDown, FileIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import RxFormOptions from "../data/RxFormOptions.json";
import { UpperRightTooth, UpperLeftTooth, BottomRightTooth, BottomLeftTooth } from "../components/tooth/tooth";


// Dental Chart Selection Component
function DentalChartSelection({
    title,
    selectedTeeth,
    onToothSelect
}: {
    title: string;
    selectedTeeth: Set<string>;
    onToothSelect: (toothId: string) => void;
}) {
    const teeth = [8, 7, 6, 5, 4, 3, 2, 1];

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {title}
            </label>
            <div className="relative overflow-x-auto">
                <div className="space-y-6 min-w-max flex lg:flex-row md:flex-row lg:border-b">
                    <div className="border-r pr-1 sm:mb-5">
                        <div className="text-xs text-gray-500 font-medium text-right">Upper Right</div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1 lg:h-[3rem] md:h-[3.5rem] sm:h-[3.5rem] h-[1.2rem] ur-tooth">
                                {teeth.map((tooth) => {
                                    const toothId = `upper-right-${tooth}`;
                                    const isSelected = selectedTeeth.has(toothId);
                                    return (
                                        <UpperRightTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => onToothSelect(toothId)}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                    <div className="pl-1">
                        <div className="text-xs text-gray-500 font-medium text-left">Upper Left</div>
                        <div className="flex items-center justify-between gap-2">

                            <div className="flex gap-1 lg:h-[3rem] md:h-[3.5rem] sm:h-[3.5rem] h-[1.2rem] ul-tooth">
                                {teeth.slice().reverse().map((tooth) => {
                                    const toothId = `upper-left-${tooth}`;
                                    const isSelected = selectedTeeth.has(toothId);
                                    return (
                                        <UpperLeftTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => onToothSelect(toothId)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="h-[1px] w-full bg-gray-100 lg:hidden" id="mob-border" style={{
                    position: "relative",
                    top: "-6px"
                }}></div>
                <div className="space-y-6 min-w-max flex lg:flex-row md:flex-row">
                    <div className="border-r pr-1 sm:mb-6">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1 lg:h-[3.5rem] md:h-[4rem] sm:h-[3.2rem] h-[1.4rem] br-tooth">
                                {teeth.map((tooth) => {
                                    const toothId = `bottom-right-${tooth}`;
                                    const isSelected = selectedTeeth.has(toothId);
                                    return (
                                        <BottomRightTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => onToothSelect(toothId)}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                        <div className="text-xs text-gray-500 font-medium text-right">Bottom Right</div>
                    </div>
                    <div className="pl-1">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1 lg:h-[3.5rem] md:h-[4rem] sm:h-[3.2rem] h-[1.4rem] bl-tooth">
                                {teeth.slice().reverse().map((tooth) => {
                                    const toothId = `bottom-left-${tooth}`;
                                    const isSelected = selectedTeeth.has(toothId);
                                    return (
                                        <BottomLeftTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => onToothSelect(toothId)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium text-left">Bottom Left</div>
                    </div>
            
                </div>
            </div>
        </div>
    );
}

// Buttons Chart Component (keeping the original simple design)
// function DentalChart({ title }: { title: string }) {
//     const teeth = [8, 7, 6, 5, 4, 3, 2, 1];

//     return (
//         <div className="space-y-4">
//             <h4 className="font-semibold text-gray-700">{title}</h4>
//             <div className="space-y-6">
//                 {/* Upper Arch */}
//                 <div className="space-y-2">
//                     <div className="text-xs text-gray-500 font-medium">Upper Right / Upper Left</div>
//                     <div className="flex items-center justify-between gap-2">
//                         <div className="flex gap-1">
//                             {teeth.map((tooth) => (
//                                 <div
//                                     key={`upper-right-${tooth}`}
//                                     className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 bg-white"
//                                 >
//                                     {tooth}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex gap-1">
//                             {teeth.slice().reverse().map((tooth) => (
//                                 <div
//                                     key={`upper-left-${tooth}`}
//                                     className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 bg-white"
//                                 >
//                                     {tooth}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Lower Arch */}
//                 <div className="space-y-2">
//                     <div className="text-xs text-gray-500 font-medium">Bottom Right / Bottom Left</div>
//                     <div className="flex items-center justify-between gap-2">
//                         <div className="flex gap-1">
//                             {teeth.map((tooth) => (
//                                 <div
//                                     key={`lower-right-${tooth}`}
//                                     className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 bg-white"
//                                 >
//                                     {tooth}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex gap-1">
//                             {teeth.slice().reverse().map((tooth) => (
//                                 <div
//                                     key={`lower-left-${tooth}`}
//                                     className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 bg-white"
//                                 >
//                                     {tooth}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

function ActionMenu({ onGeneratePDF, onApprove, onSaveDraft }: { onGeneratePDF: () => void; onApprove: () => void; onSaveDraft: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bottom-6 right-6 z-50 flex justify-between">
            <div>
                <Button
                    onClick={onGeneratePDF}
                    className="!bg-[#efefef] !hover:bg-[#2a4a6f] !text-[#030C21] !shadow-lg !outline-none !rounded-full !h-12"
                >
                    Generate PDF
                    <FileIcon className="w-4 h-4 ml-2" />
                </Button>
            </div>
            <div className="relative">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="!bg-[#030C21] !hover:bg-[#2a4a6f] !text-white !shadow-lg !outline-none !rounded-full !h-12"
                >
                    Action
                    <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
                                onClick={() => {
                                    onApprove();
                                    setIsOpen(false);
                                }}
                            >
                                Approve
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-md"
                                onClick={() => {
                                    onSaveDraft();
                                    setIsOpen(false);
                                }}
                            >
                                Save as Draft
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const initialFormData = {
    firstName: "",
    lastName: "",
    appointmentDate: "",
    appointmentType: "",
    type: "",
    iprAtAligner: "",
    leftElastic: "",
    wearSchedule: "",
    pontic: "",
    rightElastic: "",
    alignerModifications: "",
    additionalNotes: "",
    appointmentChanged: "",
    holdAt: "",
    inOfficeAppt: "",
    virtualCheckAt: "",
    scanAt: "",
    nextScan: "",
};

export default function InvisalignRxForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);

    const options = useMemo(() => RxFormOptions, []);

    const [nonEnamelTeeth, setNonEnamelTeeth] = useState<Set<string>>(new Set());
    const [lingualTeeth, setLingualTeeth] = useState<Set<string>>(new Set());
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!toastMessage) {
            return;
        }
        const id = setTimeout(() => {
            setToastMessage(null);
        }, 3000);
        return () => {
            clearTimeout(id);
        };
    }, [toastMessage]);

    useEffect(() => {
        try {
            const storedDraft = window.localStorage.getItem("invisalignRxFormDraft");
            if (storedDraft) {
                const parsed = JSON.parse(storedDraft);
                if (parsed && typeof parsed === "object" && "formData" in parsed) {
                    setFormData((prev) => ({ ...prev, ...(parsed.formData as typeof prev) }));
                    if (Array.isArray(parsed.nonEnamelTeeth)) {
                        setNonEnamelTeeth(new Set<string>(parsed.nonEnamelTeeth));
                    }
                    if (Array.isArray(parsed.lingualTeeth)) {
                        setLingualTeeth(new Set<string>(parsed.lingualTeeth));
                    }
                } else {
                    setFormData((prev) => ({ ...prev, ...parsed }));
                }
            }
        } catch (error) {
        }
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleToothSelect = (chartType: "nonEnamel" | "lingual", toothId: string) => {
        if (chartType === "nonEnamel") {
            setNonEnamelTeeth((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(toothId)) {
                    newSet.delete(toothId);
                } else {
                    newSet.add(toothId);
                }
                return newSet;
            });
        } else {
            setLingualTeeth((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(toothId)) {
                    newSet.delete(toothId);
                } else {
                    newSet.add(toothId);
                }
                return newSet;
            });
        }
    };

    const saveFormToLocalStorage = (status: "Draft" | "Approved") => {
        const key = status === "Draft" ? "invisalignRxFormDraft" : "invisalignRxFormApproved";
        const payload = {
            formData,
            nonEnamelTeeth: Array.from(nonEnamelTeeth),
            lingualTeeth: Array.from(lingualTeeth),
        };
        try {
            window.localStorage.setItem(key, JSON.stringify(payload));
        } catch (error) {
        }
    };

    const handleGeneratePDF = () => {
        navigate("/rx-form/pdf", {
            state: {
                formData,
                nonEnamelTeeth: Array.from(nonEnamelTeeth),
                lingualTeeth: Array.from(lingualTeeth),
            },
        });
    };

    const clearForm = () => {
        setFormData(initialFormData);
        setNonEnamelTeeth(new Set());
        setLingualTeeth(new Set());
    };

    const handleApprove = () => {
        saveFormToLocalStorage("Approved");
        saveFormToLocalStorage("Draft");
        clearForm();
        setToastMessage("Form approved and saved");
    };
    
    const handleSaveDraft = () => {
        saveFormToLocalStorage("Approved");
        saveFormToLocalStorage("Draft");
        clearForm();
        setToastMessage("Draft saved");
    };

    return (
        <div className="min-h-screen lg:p-6 p-2">
            <div className="max-w-5xl mx-auto">
                {/* Close Button */}
                {/* <div className="flex justify-end mb-4">
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors" onClick={() => navigate("/")}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div> */}
                <h2 className="text-[2.2rem] font-bold text-gray-900 mb-8">Invisalign Rx Form</h2>

                {/* Form Card */}
                <div className="bg-white rounded-lg lg:p-8 p-2 text-left mb-8">

                    {/* Patient Information Section */}

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient information:</h2>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name*
                            </label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}

                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name*
                            </label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Date*
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={formData.appointmentDate}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.slice(0, 2) + '-' + value.slice(2);
                                        }
                                        if (value.length >= 5) {
                                            value = value.slice(0, 5) + '-' + value.slice(5, 9);
                                        }
                                        handleInputChange("appointmentDate", value);
                                    }}
                                    placeholder="MM-DD-YYYY"
                                    maxLength={10}
                                    className="pr-10 h-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Type*
                            </label>
                            <Select
                                value={formData.appointmentType}
                                onValueChange={(value) => handleInputChange("appointmentType", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.appointmentType.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>
                <div className="bg-white rounded-lg lg:p-8 p-2 text-left mb-8">
                    {/* Case Review Details Section */}

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Review Details</h2>

                    {/* General Details */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleInputChange("type", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.type.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Wear Schedule
                            </label>
                            <Select
                                value={formData.wearSchedule}
                                onValueChange={(value) => handleInputChange("wearSchedule", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.wearSchedule.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IPR @ Aligner
                            </label>
                            <Input
                                value={formData.iprAtAligner}
                                onChange={(e) => handleInputChange("iprAtAligner", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pontic
                            </label>
                            <Input
                                value={formData.pontic}
                                onChange={(e) => handleInputChange("pontic", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Left Elastic
                            </label>
                            <Select
                                value={formData.leftElastic}
                                onValueChange={(value) => handleInputChange("leftElastic", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.leftElastic.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Right Elastic
                            </label>
                            <Select
                                value={formData.rightElastic}
                                onValueChange={(value) => handleInputChange("rightElastic", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.rightElastic.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Dental Charts */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-6 mb-6">
                        <DentalChartSelection
                            title="Non Enamel"
                            selectedTeeth={nonEnamelTeeth}
                            onToothSelect={(toothId) => handleToothSelect("nonEnamel", toothId)}
                        />
                        <DentalChartSelection
                            title="Lingual"
                            selectedTeeth={lingualTeeth}
                            onToothSelect={(toothId) => handleToothSelect("lingual", toothId)}
                        />
                    </div>

                    {/* Additional Information */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aligner Modifications
                            </label>
                            <Input
                                value={formData.alignerModifications}
                                onChange={(e) => handleInputChange("alignerModifications", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hold @
                            </label>
                            <Input
                                value={formData.holdAt}
                                onChange={(e) => handleInputChange("holdAt", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <Input
                                value={formData.additionalNotes}
                                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                In Office Appt
                            </label>
                            <Input
                                value={formData.inOfficeAppt}
                                onChange={(e) => handleInputChange("inOfficeAppt", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment changed
                            </label>
                            <Select
                                value={formData.appointmentChanged}
                                onValueChange={(value) => handleInputChange("appointmentChanged", value)}
                            >
                                <SelectTrigger className="w-full !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Virtual Check @
                            </label>

                            <Input
                                value={formData.virtualCheckAt}
                                onChange={(e) => handleInputChange("virtualCheckAt", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">

                            </label>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Scan @
                            </label>
                            <Input
                                value={formData.scanAt}
                                onChange={(e) => handleInputChange("scanAt", e.target.value)}
                            />

                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">

                            </label>


                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next Scan
                            </label>
                            <Input
                                value={formData.nextScan}
                                onChange={(e) => handleInputChange("nextScan", e.target.value)}

                            />
                        </div>
                    </div>

                </div>

                <ActionMenu
                    onGeneratePDF={handleGeneratePDF}
                    onApprove={handleApprove}
                    onSaveDraft={handleSaveDraft}
                />
                {toastMessage && (
                    <div className="fixed bottom-24 right-6 z-50 rounded-md bg-gray-900 text-white px-4 py-2 shadow-lg text-sm">
                        {toastMessage}
                    </div>
                )}
            </div>
        </div >
    );
}
