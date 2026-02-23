import { useState, useRef, useEffect } from "react";
import { PlusIcon, Search, Filter, MoreVertical, Eye, Pencil, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableRow, TableBody, TableHeader, TableHead, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import Header from "../components/common/header";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog";
import { useNavigate } from "react-router";

interface RxFormData {
    id: number;
    patientName: string;
    patientInfo: string;
    formType: string;
    lastUpdated: string;
    status: "Approved" | "Draft";
}

const mockData: RxFormData[] = [
    { id: 1, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Approved" },
    { id: 2, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Draft" },
    { id: 3, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Draft" },
    { id: 4, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Approved" },
    { id: 5, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Approved" },
    { id: 6, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Approved" },
    { id: 7, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Draft" },
    { id: 8, patientName: "Carl S Griffith", patientInfo: "Female • 45", formType: "Invisalign Rx form", lastUpdated: "03-23-2025", status: "Approved" },
];

interface Patient {
    id: number;
    name: string;
    email: string;
    initials: string;
}

const mockPatients: Patient[] = [
    { id: 1, name: "Megan Smith", email: "megan.smith@gmail.com", initials: "MS" },
    { id: 2, name: "Carl S Driffith", email: "carl.driffith@gmail.com", initials: "CD" },
    { id: 3, name: "Carl Smith", email: "carl.smith@gmail.com", initials: "CS" },
    { id: 4, name: "Carley Molly", email: "carl.molly@gmail.com", initials: "CM" },
    { id: 5, name: "Carl Grif", email: "carl.grif@gmail.com", initials: "CG" },
    { id: 6, name: "John Fisher", email: "john.fisher@gmail.com", initials: "JF" },
    { id: 7, name: "Sarah Johnson", email: "sarah.johnson@gmail.com", initials: "SJ" },
    { id: 8, name: "Michael Brown", email: "michael.brown@gmail.com", initials: "MB" },
];

function StatusBadge({ status }: { status: "Approved" | "Draft" }) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
            )}
        >
            {status}
        </span>
    );
}

function ActionMenu({ rowId: _rowId, goToEditPage, goToPDFView }: { rowId: number, goToEditPage: () => void, goToPDFView: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:bg-gray-100 rounded"
            >
                <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => {
                                setIsOpen(false);
                                goToPDFView();
                            }}
                        >
                            <Eye className="w-4 h-4" />
                            View PDF
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => {
                                setIsOpen(false);
                                goToEditPage();
                            }}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function RxFormTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownContainerRef.current &&
                !dropdownContainerRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const goToEditPage = () => {
        navigate("/rx-form/edit");
    };

    const goToPDFView = (rowData?: RxFormData) => {
        // Create form data from row data or use default values
        const formData = {
            firstName: rowData?.patientName.split(" ")[0] || "Megan",
            lastName: rowData?.patientName.split(" ").slice(1).join(" ") || "Smith",
            appointmentDate: rowData?.lastUpdated || "06-14-2025",
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
        
        navigate("/rx-form/pdf", { state: { formData } });
    };

    const filteredPatients = mockPatients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPatient = () => {
        if (selectedPatient) {
            // Add logic to add patient to table here
            console.log("Adding patient:", selectedPatient);
            setIsDialogOpen(false);
            setSelectedPatient(null);
            setSearchQuery("");
            setIsDropdownOpen(false);
        }
    };

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setSearchQuery(patient.name);
        setIsDropdownOpen(false);
    };

    return (
        <div className="min-h-screen min-w-screen bg-[#FAFAFB]">
            <div className="max-w-7xl mx-auto">
                {/* Header with Add Rx button */}
                <Header 
                    pageTitle="RxForm" 
                    btnLbl="Add RxForm" 
                    btnIcon={PlusIcon}
                    onButtonClick={() => setIsDialogOpen(true)}
                />

                {/* White card container */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Search and Filter */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b">
                                    <TableHead className="font-semibold text-gray-700">Patient Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Form Type</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockData.map((row) => (
                                    <TableRow key={row.id} className="border-b hover:bg-gray-50">
                                        <TableCell className="py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{row.patientName}</div>
                                                <div className="text-sm text-gray-500">{row.patientInfo}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-gray-700">{row.formType}</TableCell>
                                        <TableCell className="py-4 text-gray-700">{row.lastUpdated}</TableCell>
                                        <TableCell className="py-4">
                                            <StatusBadge status={row.status} />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <ActionMenu rowId={row.id} goToEditPage={goToEditPage} goToPDFView={() => goToPDFView(row)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                    currentPage === page
                                        ? "bg-[#1e3a5f] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-2 text-gray-500">...</span>
                        <button
                            onClick={() => setCurrentPage(10)}
                            className={cn(
                                "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                currentPage === 10
                                    ? "bg-[#1e3a5f] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            10
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Rx Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                    setSelectedPatient(null);
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-[600px] bg-white [&>button]:bg-black/50">
                    <DialogHeader>
                        <DialogTitle className="text-left text-xl font-bold">Add Rx</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-2 block">
                                Select Patient*
                            </label>
                            <div className="relative" ref={dropdownContainerRef}>
                                <div className="flex items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                
                                {isDropdownOpen && (filteredPatients.length > 0 || searchQuery === "") && (
                                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                                        <div className="px-4 py-2 text-xs uppercase text-gray-500 font-medium border-b">
                                            SUGGESTIONS
                                        </div>
                                        {(searchQuery === "" ? mockPatients : filteredPatients).map((patient, index) => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handlePatientSelect(patient)}
                                                className={cn(
                                                    "w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
                                                    index === 0 && "bg-gray-50"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                                                    {patient.initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {patient.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {patient.email}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-row justify-between sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setSelectedPatient(null);
                                setSearchQuery("");
                                setIsDropdownOpen(false);
                            }}
                            className="bg-white text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddPatient}
                            disabled={!selectedPatient}
                            className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}