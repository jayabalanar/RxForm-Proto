import { useState, useRef, useEffect, useMemo } from "react";
import { PlusIcon, Search, MoreVertical, Eye, Pencil, Copy, ChevronLeft, ChevronRight, SlidersHorizontalIcon, CalendarIcon } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"


interface RxFormData {
    id: number;
    firstName: string
    lastName: string
    form_data: any
    appointmentDate: string
    appointmentType: string
    type: string
    iprAtAligner: string
    leftElastic: string
    wearSchedule: string
    pontic: string
    rightElastic: string
    alignerModifications: string
    additionalNotes: string
    appointmentChanged: string
    holdAt: string
    inOfficeAppt: string
    virtualCheckAt: string
    scanAt: string
    nextScan: string
    nonEnamelTeeth: string[]
    lingualTeeth: string[]
    buttonTeeth: string[]
    patientImage: string
    Gender: string
    Age: number
    formType: string
    lastUpdatedAt: string
    status: string
}

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
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-50 p-0 overflow-hidden" align="end">
                    <Button
                        variant="ghost"
                        className="!bg-white w-full !text-left !p-2 text-sm text-gray-700 hover:!bg-gray-100 flex items-center gap-2 justify-start !rounded-none"
                        onClick={() => {
                            setIsOpen(false);
                            goToPDFView();
                        }}
                    >
                        <Eye className="w-4 h-4" />
                        View PDF
                    </Button>
                    <Button
                        variant="ghost"
                        className="!bg-white w-full !text-left !p-2 text-sm text-gray-700 hover:!bg-gray-100 flex items-center gap-2 justify-start !rounded-none"
                        onClick={() => {
                            setIsOpen(false);
                            goToEditPage();
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        className="!bg-white w-full !text-left !p-2 text-sm text-gray-700 hover:!bg-gray-100 flex items-center gap-2 justify-start !rounded-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <Copy className="w-4 h-4" />
                        Copy Link
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default function RxFormTable() {
    const [currentPage, setCurrentPage] = useState(1);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableSearchQuery, setTableSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [savingData, setSavingData] = useState(false);

    const navigate = useNavigate();
    const [patientData, setPatientData] = useState<any>()
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        firstName: "",
        lastName: "",
        dob: null,
    });
    const itemsPerPage = 10
    const filteredTableData = useMemo(() => {
        if (!patientData) return [];
        const query = tableSearchQuery.trim().toLowerCase();
        if (!query) return patientData;

        return patientData.filter((row: any) => {
            const fullName = `${row.firstName ?? ""} ${row.lastName ?? ""}`.toLowerCase();
            const formType = (row.formType ?? "").toLowerCase();
            return fullName.includes(query) || formType.includes(query);
        });
    }, [patientData, tableSearchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredTableData.length / itemsPerPage));

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

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTableData.slice(start, start + itemsPerPage);
    }, [filteredTableData, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tableSearchQuery]);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    useEffect(() => {
        const fetchPatients = async () => {
            const resData = await fetch("https://rxform-production.up.railway.app/get-patient", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!resData.ok) {
                throw new Error("No Data Found")
            }
            const result = resData.json()
            result.then((res) => {
                console.log(res);
                setPatientData(res.data)
            })
                .catch((err) => {
                    console.log(err);
                })

        }
        fetchPatients()
    }, [])

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

    const goToEditPage = (row: any) => {
        navigate("/rx-form/edit", {
            state: row
        });
    };

    const goToPDFView = (rowData?: RxFormData) => {
        if (!rowData) return;

        const formData = {
            ...rowData.form_data,
            appointmentDate: rowData.form_data?.appointmentDate
                ? new Date(rowData.form_data.appointmentDate)
                : null,
            firstName: (`${rowData.firstName} ${rowData.lastName}`).split(" ")[0] || "",
            lastName: (`${rowData.firstName} ${rowData.lastName}`).split(" ").slice(1).join(" ") || "",
        };

        const payload = { formData };

        try {
            // Store in both sessionStorage (current tab) and localStorage (for the new tab)
            window.sessionStorage.setItem("rxFormPdfPayload", JSON.stringify(payload));
            window.localStorage.setItem("rxFormPdfPayload", JSON.stringify(payload));
        } catch (error) {
            console.error("Failed to store PDF payload", error);
        }

        // Open PDF view in a new tab
        window.open("/rx-form/pdf", "_blank", "noopener,noreferrer");
    };

    const filteredPatients = patientData
        ? patientData.filter(
            (patient: any) =>
                (patient.firstName + patient.lastName)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )
        : [];
    const fetchPatients = async () => {
        const resData = await fetch("https://rxform-production.up.railway.app/get-patient", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!resData.ok) {
            throw new Error("No Data Found")
        }
        const result = resData.json()
        result.then((res) => {
            console.log(res);
            setPatientData(res.data)
        })
            .catch((err) => {
                console.log(err);
            })

    }
    const savePresToDb = async (type: string) => {
        setSavingData(true);
        let tempGend = ["Male", "Female"]
        let tempFormData = {
            firstName: selectedPatient?.firstName || formData?.firstName,
            lastName: selectedPatient?.lastName || formData?.lastName,
            dob: formData?.dob.toISOString(),
            email: (selectedPatient?.firstName || formData?.firstName) + (selectedPatient?.lastName || formData?.lastName) + "@gmail.com",
            patientImage: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 20)}.jpg`,
            Gender: tempGend[Math.floor(Math.random() * 2)],
            Age: Math.floor(Math.random() * 100),
            formType: "Invisalign Rx Form",
            lastUpdatedAt: new Date().toISOString(),
            status: type == "approve" ? "Approved" : "Draft",
            formId: null
        }
        let sendFormData = {
            formData: tempFormData
        }

        const savedPresData = await fetch("https://rxform-production.up.railway.app/post-prescription", {
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
        result.then((res) => {
            console.log(res)
            setIsDialogOpen(false);
            setSelectedPatient(null);
            setSearchQuery("");
            setIsDropdownOpen(false);
            fetchPatients()

            setToastMessage(type == "approve" ? "Approved" : "Saved as Draft");
            setSavingData(false);
        })
            .catch((err) => {
                console.log(err);
                setSavingData(false);
                setToastMessage("Error Occurred");
            })
    }

    const handleAddPatient = () => {
        if (selectedPatient) {
            savePresToDb("draft")
            return;
        }
        if (!selectedPatient) {
            savePresToDb("draft")
        }

    };

    const handlePatientSelect = (patient: any) => {
        setSelectedPatient(patient);
        setSearchQuery(patient.firstName + patient.lastName);
        setIsDropdownOpen(false);
    };
    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };
    const handleDateChange = (date: Date | null) => {
        setFormData({ ...formData, dob: date });
    };
    const [date, setDate] = useState<Date | undefined>(undefined);



    return (
        <div className="min-h-screen bg-[#FAFAFB]">
            <div className="max-w-7xl mx-auto p-2 pl-2 pr-2 lg:p-5 lg:pl-10 lg:pr-10">
                {/* Header with Add Rx button */}
                <Header
                    pageTitle="RxForm"
                    btnLbl="Add Rx"
                    btnIcon={PlusIcon}
                    onButtonClick={() => setIsDialogOpen(true)}
                />

                {/* White card container */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Search and Filter */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={tableSearchQuery}
                                onChange={(e) => setTableSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" className="!bg-[#F5F5F7] !border-[#EBECEE] flex items-center gap-2 !rounded-full w-[100px] border border-gray-300">
                            <SlidersHorizontalIcon className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table className="w-full overflow-hidden rounded-md">
                            <TableHeader className="bg-[#F5F5F7] border-b">
                                <TableRow className="border-b">
                                    <TableHead className="min-w-[200px]">Patient Name</TableHead>
                                    <TableHead className="min-w-[200px]">Form Type</TableHead>
                                    <TableHead className="min-w-[150px]">Last Updated</TableHead>
                                    <TableHead className="min-w-[100px]">Status</TableHead>
                                    <TableHead className="min-w-[100px] text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData && paginatedData?.length > 0
                                    ? paginatedData?.map((row: any) => (
                                        <TableRow key={row.id} className="border-b hover:bg-gray-50">
                                            <TableCell className="py-4 min-w-[200px]">
                                                <div className="flex flex-row items-center gap-2">
                                                    <div className="w-10 h-10">
                                                        <span className="text-sm text-gray-500 w-full h-full flex items-center justify-center rounded-full bg-[#F5F5F7]">{row.firstName.charAt(0) + row.lastName.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{row.firstName + " " + row.lastName}</div>
                                                        <div className="text-sm text-gray-500">{row.Gender} {row.Age}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-gray-700 min-w-[200px]">{row.formType}</TableCell>
                                            <TableCell className="py-4 text-gray-700 min-w-[150px]">
                                                {new Date(row?.lastUpdatedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || "-"}
                                            </TableCell>
                                            <TableCell className="py-4 min-w-[100px]">
                                                <StatusBadge status={row.status} />
                                            </TableCell>
                                            <TableCell className="py-4 min-w-[100px] text-right">
                                                <ActionMenu
                                                    rowId={row.id} goToEditPage={() => goToEditPage(row)}
                                                    goToPDFView={() => goToPDFView(row)} />
                                            </TableCell>
                                        </TableRow>
                                    )) :
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-15 font-bold text-gray-600 text-xl text-center">
                                            No Data Found.
                                        </TableCell>
                                    </TableRow>}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {/* Previous */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span key={index} className="px-2 text-gray-500">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page as number)}
                                    className={cn(
                                        "!bg-[#1e3a5f] w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                        currentPage === page
                                            ? "bg-[#1e3a5f] text-white"
                                            : "!bg-white text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        {/* Next */}
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
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
                        <div className="lg:w-[300px]">
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
                                        {(searchQuery === "" ? patientData : filteredPatients).map((patient: any, index: any) => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handlePatientSelect(patient)}
                                                className={cn(
                                                    "w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
                                                    index === 0 && "bg-gray-50"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                                                    <span className="text-sm text-gray-500 w-full h-full flex items-center justify-center rounded-full bg-[#F5F5F7]">{patient?.firstName.charAt(0) + patient?.lastName.charAt(0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-medium text-gray-900 truncate">
                                                            {patient?.firstName}
                                                        </span>
                                                        <span className="text-medium text-gray-900 truncate">
                                                            {patient?.lastName}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-medium text-gray-500 text-xs truncate">
                                                            {patient?.form_data?.email || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div className="w-full">
                            <label className="text-sm text-gray-500 mb-2 block">
                                Add New Patient*
                            </label>
                            <div className="relative flex md:flex-row lg:flex-row flex-col gap-2">
                                <div className="w-full lg:w-[50%]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name*
                                    </label>
                                    <Input
                                        value={formData?.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    />
                                </div>
                                <div className="w-full lg:w-[50%]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name*
                                    </label>
                                    <Input
                                        value={formData?.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    />
                                </div>
                                <div className="w-full lg:w-[50%]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth*
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
                            </div>
                        </div>
                    </div>
                    {toastMessage && (
                        <div className="fixed bottom-24 right-6 z-50 rounded-md bg-gray-900 text-white px-4 py-2 shadow-lg text-sm">
                            {toastMessage}
                        </div>
                    )}
                    <DialogFooter className="flex flex-row justify-end sm:justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setSelectedPatient(null);
                                setSearchQuery("");
                                setIsDropdownOpen(false);
                            }}
                            className=" !p-5 !rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            disabled={savingData}
                            onClick={handleAddPatient}
                            className="!bg-[#1e3a5f] text-white !p-5 !rounded-full"
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}