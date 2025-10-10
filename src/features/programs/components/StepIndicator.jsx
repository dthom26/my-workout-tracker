import React from "react";

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep >= index + 1 ? "active" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
