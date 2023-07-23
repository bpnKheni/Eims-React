const success = "successfully!";
const subject = "Subject",
  standard = "Standard",
  shift = "Shift",
  batch = "Batch",
  stdAndBatch = "Standard & Batch",
  add = "added",
  update = "updated",
  removed = "removed";

export const RESPONSE = {
  SUCCESS: {
    STANDARD: {
      CREATED: `${standard} ${add} ${success}`,
      UPDATED: `${standard} ${update} ${success}`,
      REMOVED: `${standard} ${removed} ${success}`,
    },
    SUBJECT: {
      CREATED: `${subject} ${add} ${success}`,
      UPDATED: `${subject} ${update} ${success}`,
      REMOVED: `${subject} ${removed} ${success}`,
    },
    SHIFT: {
      CREATED: `${shift} ${add} ${success}`,
      UPDATED: `${shift} ${update} ${success}`,
      REMOVED: `${shift} ${removed} ${success}`,
    },
    BATCH: {
      CREATED: `${batch} ${add} ${success}`,
      UPDATED: `${batch} ${update} ${success}`,
      REMOVED: `${batch} ${removed} ${success}`,
    },
    STD_AND_BATCH: {
      CREATED: `${stdAndBatch} ${add} ${success}`,
      UPDATED: `${stdAndBatch} ${update} ${success}`,
      REMOVED: `${stdAndBatch} ${removed} ${success}`,
    },
  },
};
