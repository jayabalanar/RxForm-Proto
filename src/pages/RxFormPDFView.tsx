import { useNavigate, useLocation } from "react-router";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { UpperRightTooth, UpperLeftTooth, BottomRightTooth, BottomLeftTooth } from "../components/tooth/tooth";
import { useEffect, useRef } from "react";

interface FormData {
    firstName: string;
    lastName: string;
    appointmentDate: string;
    appointmentType: string;
    type: string;
    iprAtAligner: string;
    leftElastic: string;
    wearSchedule: string;
    pontic: string;
    rightElastic: string;
    alignerModifications: string;
    additionalNotes: string;
    appointmentChanged: string;
    holdAt: string;
    inOfficeAppt: string;
    virtualCheckAt: string;
    scanAt: string;
    nextScan: string;
}

function DentalChartPDF({ title, selectedTeeth }: { title: string; selectedTeeth?: Set<string> }) {
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
                                    const isSelected = selectedTeeth ? selectedTeeth.has(toothId) : false;
                                    return (
                                        <UpperRightTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => { }}
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
                                    const isSelected = selectedTeeth ? selectedTeeth.has(toothId) : false;
                                    return (
                                        <UpperLeftTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => { }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="h-[1px] w-full bg-gray-100 lg:hidden"
                    style={{
                        position: "relative",
                        top: "-8px",
                    }}
                ></div>
                <div className="space-y-6 min-w-max flex lg:flex-row md:flex-row">
                    <div className="border-r pr-1 sm:mb-6">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-1 lg:h-[3.5rem] md:h-[4rem] sm:h-[3.2rem] h-[1.4rem] br-tooth">
                                {teeth.map((tooth) => {
                                    const toothId = `bottom-right-${tooth}`;
                                    const isSelected = selectedTeeth ? selectedTeeth.has(toothId) : false;
                                    return (
                                        <BottomRightTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => { }}
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
                                    const isSelected = selectedTeeth ? selectedTeeth.has(toothId) : false;
                                    return (
                                        <BottomLeftTooth
                                            key={toothId}
                                            toothNumber={tooth}
                                            isSelected={isSelected}
                                            onClick={() => { }}
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

export default function RxFormPDFView() {
    const navigate = useNavigate();
    const location = useLocation();
    const printRef = useRef<HTMLDivElement>(null);

    const defaultFormData: FormData = {
        firstName: "Megan",
        lastName: "Smith",
        appointmentDate: "06-14-2025",
        appointmentType: "STInv",
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

    let storedPayload: any = null;
    try {
        const approved = window.localStorage.getItem("invisalignRxFormApproved");
        const draft = window.localStorage.getItem("invisalignRxFormDraft");
        const raw = approved ?? draft;
        if (raw) {
            storedPayload = JSON.parse(raw);
        }
    } catch (error) {
        storedPayload = null;
    }

    const state = location.state as
        | {
            formData?: FormData;
            nonEnamelTeeth?: string[];
            lingualTeeth?: string[];
        }
        | undefined;

    const stateFormData = state && state.formData;
    const hasStateFormData =
        stateFormData &&
        Object.values(stateFormData).some((value) => value !== undefined && String(value).trim() !== "");

    const formData: FormData =
        (hasStateFormData ? stateFormData : undefined) ||
        (storedPayload && storedPayload.formData) ||
        storedPayload ||
        defaultFormData;

    const stateNonEnamel = state && state.nonEnamelTeeth;
    const hasStateNonEnamel = !!stateNonEnamel && stateNonEnamel.length > 0;

    const nonEnamelTeeth = new Set<string>(
        (hasStateNonEnamel ? stateNonEnamel : undefined) ||
        (storedPayload && Array.isArray(storedPayload.nonEnamelTeeth) ? storedPayload.nonEnamelTeeth : [])
    );

    const stateLingual = state && state.lingualTeeth;
    const hasStateLingual = !!stateLingual && stateLingual.length > 0;

    const lingualTeeth = new Set<string>(
        (hasStateLingual ? stateLingual : undefined) ||
        (storedPayload && Array.isArray(storedPayload.lingualTeeth) ? storedPayload.lingualTeeth : [])
    );


    useEffect(() => {
        // Auto-print when component mounts (optional)
        // window.print();
    }, []);

    return (
        <div className="min-h-screen lg:p-6 p-2 print:p-0 print:bg-white">
            {/* Print Controls - Hidden when printing */}
            <div className="max-w-5xl mx-auto mb-4 print:hidden">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Close
                    </Button>
                    {/* <Button
                        onClick={handlePrint}
                        className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print / Save as PDF
                    </Button> */}
                </div>
            </div>

            {/* PDF Content - A4 Size (responsive on screen) */}
            <div
                ref={printRef}
                className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none print:p-12"
                style={{
                    width: "100%",
                    maxWidth: "210mm",
                    minHeight: "297mm",
                    margin: "0 auto",
                    padding: "10px"
                }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 print:mb-6">Invisalign Rx Form</h2>

                {/* Patient Information Section */}
                <div className="mb-8 print:mb-6 text-left">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-3">Patient information:</h2>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 print:gap-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                First Name*
                            </label>
                            <div className="text-base text-gray-900 font-medium print:text-sm">
                                {formData.firstName || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Last Name*
                            </label>
                            <div className="text-base text-gray-900 font-medium print:text-sm">
                                {formData.lastName || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Appointment Date*
                            </label>
                            <div className="text-base text-gray-900 font-medium print:text-sm">
                                {formData.appointmentDate || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Appointment Type*
                            </label>
                            <div className="text-base text-gray-900 font-medium print:text-sm">
                                {formData.appointmentType || "-"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case Review Details Section */}
                <div className="mb-8 print:mb-6 text-left">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 print:mb-3">Case Review Details</h2>

                    {/* General Details */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 mb-6 print:mb-4 print:gap-2 row-gap-6" style={{
                        rowGap: "20px"
                    }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Type
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.type || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Wear Schedule
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.wearSchedule || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                IPR @ Aligner
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.iprAtAligner || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Pontic
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.pontic || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Left Elastic
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.leftElastic || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Right Elastic
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.rightElastic || "-"}
                            </div>
                        </div>
                    </div>

                    {/* Dental Charts */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 print:grid-cols-2 sm:grid-cols-1 gap-6 mb-6 print:gap-1" id="isView">
                        <DentalChartPDF title="Non Enamel" selectedTeeth={nonEnamelTeeth} />
                        <DentalChartPDF title="Lingual" selectedTeeth={lingualTeeth} />
                    </div>

                    {/* Additional Information */}
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 print:gap-2 row-gap-6" style={{
                        rowGap: "20px"
                    }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Aligner Modifications
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.alignerModifications || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Hold @
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.holdAt || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Additional Notes
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.additionalNotes || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                In Office Appt
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.inOfficeAppt || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Appointment changed
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.appointmentChanged || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Virtual Check @
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.virtualCheckAt || "-"}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Scan @
                            </label>
                            <div className="text-base text-gray-900 whitespace-pre-wrap print:text-sm ">
                                {formData.scanAt || "-"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 print:text-xs">
                                Next Scan
                            </label>
                            <div className="text-base text-gray-900 print:text-sm">
                                {formData.nextScan || "-"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                    .print\\:p-12 {
                        padding: 3rem !important;
                    }
                    .print\\:mb-6 {
                        margin-bottom: 1.5rem !important;
                    }
                    .print\\:mb-4 {
                        margin-bottom: 1rem !important;
                    }
                    .print\\:mb-3 {
                        margin-bottom: 0.75rem !important;
                    }
                    .print\\:gap-3 {
                        gap: 0.75rem !important;
                    }
                    .print\\:gap-4 {
                        gap: 1rem !important;
                    }
                    .print\\:text-xs {
                        font-size: 0.75rem !important;
                    }
                    .print\\:text-sm {
                        font-size: 0.875rem !important;
                    }
                    .print\\:border-gray-800 {
                        border-color: #1f2937 !important;
                    }
                    #isView svg {
                        height: 2rem;
                        width: 1rem;
                    }

                }
            `}</style>
        </div>
    );
}
