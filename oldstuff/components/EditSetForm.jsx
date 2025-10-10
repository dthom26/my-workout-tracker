import React from "react";

const EditSetForm = () => {
  return (
    <div>
      <label>
        Weight:
        <input
          onChange={handleChange}
          type="number"
          name="weight"
          id="weight"
        />
      </label>
      <label>
        Reps:
        <input onChange={handleChange} type="number" name="reps" id="reps" />
      </label>
      <label>
        RPE:
        <input onChange={handleChange} type="number" name="rpe" id="rpe" />
      </label>
    </div>
  );
};

export default EditSetForm;
