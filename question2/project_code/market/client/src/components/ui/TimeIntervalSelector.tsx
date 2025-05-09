import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface TimeIntervalSelectorProps {
  selectedInterval: number;
  onIntervalChange: (value: number) => void;
}

const TimeIntervalSelector = ({ selectedInterval, onIntervalChange }: TimeIntervalSelectorProps) => {
  const intervals = [
    { value: 30, label: "Last 30 minutes" },
    { value: 60, label: "Last 60 minutes" },
    { value: 120, label: "Last 2 hours" },
    { value: 240, label: "Last 4 hours" }
  ];

  return (
    <Select
      value={selectedInterval.toString()}
      onValueChange={(value) => onIntervalChange(parseInt(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time interval" />
      </SelectTrigger>
      <SelectContent>
        {intervals.map((interval) => (
          <SelectItem key={interval.value} value={interval.value.toString()}>
            {interval.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeIntervalSelector;
