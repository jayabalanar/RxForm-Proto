import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, ChevronDown, X } from "lucide-react";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { format } from "date-fns"
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router";
import RxFormOptions from "../data/RxFormOptions.json";
import { UpperRightTooth, UpperLeftTooth, BottomRightTooth, BottomLeftTooth } from "../components/tooth/tooth";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"

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

function ActionMenu({ onApprove, onSaveDraft }: { onGeneratePDF: () => void; onApprove: () => void; onSaveDraft: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bottom-6 right-6 z-50 flex justify-between">
            <div>
                {/* <Button
                    onClick={onGeneratePDF}
                    className="!bg-[#efefef] !hover:bg-[#2a4a6f] !text-[#030C21] !shadow-lg !outline-none !rounded-full !h-12 !p-2 !pl-4 !pr-4"
                >
                    Generate PDF
                    <FileIcon className="w-4 h-4 ml-2" />
                </Button> */}
            </div>
            <div className="relative">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="!bg-[#030C21] !hover:bg-[#2a4a6f] !text-white !shadow-lg !outline-none !rounded-full !h-12 !p-2 !pl-4 !pr-4"
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
    appointmentDate: new Date(),
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
    const [formData, setFormData] = useState<any>(initialFormData);
    const location = useLocation()

    const pathData = location.state

    const options = useMemo(() => RxFormOptions, []);

    const [nonEnamelTeeth, setNonEnamelTeeth] = useState<Set<string>>(new Set());
    const [lingualTeeth, setLingualTeeth] = useState<Set<string>>(new Set());
    const [buttonTeeth, setButtonTeeth] = useState<Set<string>>(new Set());

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [date, setDate] = React.useState<Date | undefined>(undefined)

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
        if (!pathData) return;

        const source: any = (pathData as any).form_data ?? pathData;

        if (source && typeof source === "object") {
            const merged = { ...initialFormData, ...source };
            setFormData(merged);

            if (merged.appointmentDate) {
                const d = new Date(merged.appointmentDate);
                if (!isNaN(d.getTime())) {
                    setDate(d);
                }
            }
        }

        const srcNonEnamel = (source as any).nonEnamelTeeth ?? (pathData as any).nonEnamelTeeth;
        const srcLingual = (source as any).lingualTeeth ?? (pathData as any).lingualTeeth;
        const srcButton = (source as any).buttonTeeth ?? (pathData as any).buttonTeeth;

        if (Array.isArray(srcNonEnamel)) {
            setNonEnamelTeeth(new Set(srcNonEnamel));
        }

        if (Array.isArray(srcLingual)) {
            setLingualTeeth(new Set(srcLingual));
        }

        if (Array.isArray(srcButton)) {
            setButtonTeeth(new Set(srcButton));
        }

    }, [pathData]);

    useEffect(() => {
        console.log(formData);
        console.log(pathData);

    }, [formData, pathData])

    useEffect(() => {
        if (pathData) return;

        try {
            const storedDraft = window.localStorage.getItem("invisalignRxFormDraft");
            if (storedDraft) {
                const parsed = JSON.parse(storedDraft);
                if (parsed && typeof parsed === "object" && "formData" in parsed) {
                    setFormData((prev: any) => ({ ...prev, ...(parsed.formData as typeof prev) }));
                    if (Array.isArray(parsed.nonEnamelTeeth)) {
                        setNonEnamelTeeth(new Set<string>(parsed.nonEnamelTeeth));
                    }
                    if (Array.isArray(parsed.lingualTeeth)) {
                        setLingualTeeth(new Set<string>(parsed.lingualTeeth));
                    }
                    if (Array.isArray(parsed.buttonTeeth)) {
                        setButtonTeeth(new Set<string>(parsed.buttonTeeth));
                    }
                } else {
                    setFormData((prev: any) => ({ ...prev, ...parsed }));
                }
            }
        } catch (error) {
        }
    }, [pathData]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev: any) => ({ ...prev, appointmentDate: date || new Date() }));
    };

    const handleToothSelect = (chartType: "nonEnamel" | "lingual" | "button", toothId: string) => {
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
        } else if (chartType === "lingual") {
            setLingualTeeth((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(toothId)) {
                    newSet.delete(toothId);
                } else {
                    newSet.add(toothId);
                }
                return newSet;
            });
        } else if (chartType === "button") {
            setButtonTeeth((prev) => {
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

    // const saveFormToLocalStorage = (status: "Draft" | "Approved") => {
    //     const key = status === "Draft" ? "invisalignRxFormDraft" : "invisalignRxFormApproved";
    //     const payload = {
    //         formData,
    //         nonEnamelTeeth: Array.from(nonEnamelTeeth),
    //         lingualTeeth: Array.from(lingualTeeth),
    //         buttonTeeth: Array.from(buttonTeeth),

    //     };
    //     try {
    //         window.localStorage.setItem(key, JSON.stringify(payload));
    //     } catch (error) {
    //     }
    // };

    const handleGeneratePDF = () => {
        navigate("/rx-form/pdf", {
            state: {
                formData,
                nonEnamelTeeth: Array.from(nonEnamelTeeth),
                lingualTeeth: Array.from(lingualTeeth),
                buttonTeeth: Array.from(buttonTeeth),
            },
        });
    };

    const clearForm = () => {
        setFormData(initialFormData);
        setNonEnamelTeeth(new Set());
        setLingualTeeth(new Set());
        setButtonTeeth(new Set());
    };

    const savePresToDb = async (type: string) => {
        let tempGend = ["Male", "Female"]
        let tempFormData = {
            ...formData,
            nonEnamelTeeth: Array.from(nonEnamelTeeth),
            lingualTeeth: Array.from(lingualTeeth),
            buttonTeeth: Array.from(buttonTeeth),
            email: formData.firstName + formData.lastName + "@gmail.com",
            patientImage: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 20)}.jpg`,
            Gender: tempGend[Math.floor(Math.random() * 2)],
            Age: Math.floor(Math.random() * 100),
            formType: "InvisAlign Rx Form",
            lastUpdatedAt: new Date().toISOString(),
            status: type == "approve" ? "Approved" : "Draft",
            formId: pathData?.form_id ?? null
        }
        let sendFormData = {
            formData: tempFormData
        }

        const savedPresData = await fetch("https://rxform-proto-backend.onrender.com/post-prescription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendFormData)
        })
        if (!savedPresData.ok) {
            throw new Error("Error Occurred")
        }
        const result = savedPresData.json()

        console.log(result);
        clearForm();
        setToastMessage("Form approved and saved");
    }

    // const handleApprove = () => {
    //     // saveFormToLocalStorage("Approved");
    //     // saveFormToLocalStorage("Draft");
    //     clearForm();
    //     setToastMessage("Form approved and saved");
    // };

    // const handleSaveDraft = () => {
    //     // saveFormToLocalStorage("Approved");
    //     // saveFormToLocalStorage("Draft");
    //     clearForm();
    //     setToastMessage("Draft saved");
    // };

    return (
        <div className="min-h-screen lg:p-6 p-2">
            <div className="max-w-5xl mx-auto">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors" onClick={() => navigate("/")}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
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
                                value={formData?.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}

                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name*
                            </label>
                            <Input
                                value={formData?.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Date*
                            </label>
                            <div className="relative">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!date}
                                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal !border-0 !border-b-2 !bg-[#F5F5F7] !border-[#b5b5b5] !h-10 !outline-none"
                                        >
                                            <CalendarIcon />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-1">
                                        <Calendar mode="single" selected={date}
                                            required
                                            onSelect={(date: Date) => {
                                                handleDateChange(date)
                                                setDate(date)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Type*
                            </label>
                            <Select
                                value={formData?.appointmentType}
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
                                value={formData?.type}
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
                                value={formData?.wearSchedule}
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
                                value={formData?.iprAtAligner}
                                onChange={(e) => handleInputChange("iprAtAligner", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pontic
                            </label>
                            <Input
                                value={formData?.pontic}
                                onChange={(e) => handleInputChange("pontic", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Left Elastic
                            </label>
                            <Select
                                value={formData?.leftElastic}
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
                                value={formData?.rightElastic}
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
                        <DentalChartSelection
                            title="Buttons"
                            selectedTeeth={buttonTeeth}
                            onToothSelect={(toothId) => handleToothSelect("button", toothId)}
                        />
                    </div>

                    {/* Additional Information */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aligner Modifications
                            </label>
                            <Input
                                value={formData?.alignerModifications}
                                onChange={(e) => handleInputChange("alignerModifications", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hold @
                            </label>
                            <Input
                                value={formData?.holdAt}
                                onChange={(e) => handleInputChange("holdAt", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <Input
                                value={formData?.additionalNotes}
                                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                In Office Appt
                            </label>
                            <Input
                                value={formData?.inOfficeAppt}
                                onChange={(e) => handleInputChange("inOfficeAppt", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment changed
                            </label>
                            <Select
                                value={formData?.appointmentChanged}
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
                                value={formData?.virtualCheckAt}
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
                                value={formData?.scanAt}
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
                                value={formData?.nextScan}
                                onChange={(e) => handleInputChange("nextScan", e.target.value)}

                            />
                        </div>
                    </div>

                </div>

                <ActionMenu
                    onGeneratePDF={handleGeneratePDF}
                    onApprove={() => savePresToDb("approve")}
                    onSaveDraft={() => savePresToDb("draft")}
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
