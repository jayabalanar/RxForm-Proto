import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCcwIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface RxFormFilterValues {
    /** Row identifier: id, form_id, or patientId from API (stored as string for UUID support) */
    patientId: string | null;
    firstName: string;
    lastName: string;
    appointmentDate: Date | null;
    formType: string;
    status: string;
}

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "New", label: "New" },
    { value: "Draft", label: "Draft" },
    { value: "Approved", label: "Approved" },
];

interface RxFormFilterProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientData: any[] | undefined;
    formTypes: string[];
    values: RxFormFilterValues;
    onApply: (values: RxFormFilterValues) => void;
    onReset: () => void;
}

export function RxFormFilter({
    open,
    onOpenChange,
    patientData,
    formTypes,
    values,
    onApply,
    onReset,
}: RxFormFilterProps) {
    const [localValues, setLocalValues] = useState<RxFormFilterValues>(values);

    useEffect(() => {
        if (open) {
            setLocalValues(values);
        }
    }, [open, values]);

    const handleApply = () => {
        onApply(localValues);
        onOpenChange(false);
    };

    const handleReset = () => {
        const empty: RxFormFilterValues = {
            patientId: null,
            firstName: "",
            lastName: "",
            appointmentDate: null,
            formType: "",
            status: "",
        };
        setLocalValues(empty);
        onReset();
    };

    const patients = patientData ?? [];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader className="border-b">
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 py-6 px-6">
                    {/* Patient Name */}
                    <div className="grid gap-2">
                        <Label>Patient Name</Label>
                        <Select
                            value={localValues.patientId ?? "all"}
                            onValueChange={(v) => {
                                setLocalValues((prev) => ({
                                    ...prev,
                                    patientId: v === "all" ? null : v,
                                }));
                            }}
                        >
                            <SelectTrigger className="w-full !border !border-[#b5b5b5] !bg-[#F5F5F7] !h-10">
                                <SelectValue placeholder="All patients" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All patients</SelectItem>
                                {patients.map((p: any, index: number) => {
                                    const fullName = [p.firstName, p.lastName]
                                        .filter(Boolean)
                                        .join(" ");
                                    const id =
                                        p.patientId != null
                                            ? String(p.patientId)
                                            : p.id != null
                                              ? String(p.id)
                                              : p.form_id != null
                                                ? String(p.form_id)
                                                : "";
                                    if (!id) return null;
                                    return (
                                        <SelectItem key={id || `patient-${index}`} value={id}>
                                            {fullName || "Unnamed patient"}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Appointment Date */}
                    <div className="grid gap-2">
                        <Label>Appointment Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal !border !border-[#b5b5b5] !bg-[#F5F5F7] !h-10",
                                        !localValues.appointmentDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {localValues.appointmentDate
                                        ? format(localValues.appointmentDate, "PPP")
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={localValues.appointmentDate ?? undefined}
                                    onSelect={(date) =>
                                        setLocalValues((prev) => ({
                                            ...prev,
                                            appointmentDate: date ?? null,
                                        }))
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Form Type */}
                    <div className="grid gap-2">
                        <Label>Form Type</Label>
                        <Select
                            value={localValues.formType || "all"}
                            onValueChange={(v) =>
                                setLocalValues((prev) => ({
                                    ...prev,
                                    formType: v === "all" ? "" : v,
                                }))
                            }
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-full !border !border-[#b5b5b5] !bg-[#F5F5F7] !h-10"
                                )}
                            >
                                <SelectValue placeholder="All form types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All form types</SelectItem>
                                {formTypes.map((ft) => (
                                    <SelectItem key={ft} value={ft}>
                                        {ft}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={localValues.status == "" ? "all" : localValues.status}
                            onValueChange={(v) =>
                                setLocalValues((prev) => ({ ...prev, status: v == "all" ? "" : v }))
                            }
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-full !border !border-[#b5b5b5] !bg-[#F5F5F7] !h-10"
                                )}
                            >
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value || "all"} value={opt.value || "all"}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter className="flex-row gap-2 border-t text-right justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="!rounded-full !p-5"
                    >
                        <RefreshCcwIcon className="w-4 h-4" />
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApply}
                        className="!bg-[#101828] text-white !rounded-full !border !p-5"
                    >
                        Apply Filter
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
