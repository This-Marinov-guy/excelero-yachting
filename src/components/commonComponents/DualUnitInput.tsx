"use client";
import { useState, useEffect } from "react";

interface DualUnitInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    metricUnit: string;
    imperialUnit: string;
    metricToImperial: (metric: number) => number;
    formatImperial: (value: number) => string;
    type?: "number" | "text";
    step?: string;
    required?: boolean;
    className?: string;
}

const DualUnitInput: React.FC<DualUnitInputProps> = ({
    value,
    onChange,
    label,
    metricUnit,
    imperialUnit,
    metricToImperial,
    formatImperial,
    type = "number",
    step,
    required,
    className = "form-control",
}) => {
    const [imperialValue, setImperialValue] = useState<string>("");

    useEffect(() => {
        if (value && !isNaN(parseFloat(value))) {
            const metric = parseFloat(value);
            const imperial = metricToImperial(metric);
            setImperialValue(formatImperial(imperial));
        } else {
            setImperialValue("");
        }
    }, [value, metricToImperial, formatImperial]);

    return (
        <div className="dual-unit-input-wrapper">
            <label className="form-label">{label}</label>
            <div className="dual-unit-input-container">
                <div className="input-group input-with-unit-wrapper">
                    <span className="input-group-text">{metricUnit}</span>
                    <input
                        type={type}
                        step={step}
                        className={className}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        required={required !== false}
                    ></input>
                    {imperialValue && (
                        <span className="input-group-text">
                            {imperialValue} {imperialUnit}
                        </span>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default DualUnitInput;
