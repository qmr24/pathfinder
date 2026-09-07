export const APP_NAME = "PATH FINDERS";
export const APP_TAGLINE = "Your Journey to Commerce A/L Success Starts Here";
export const APP_DESCRIPTION = "A modern, secure Learning Management System for Sri Lankan Commerce A/L students offering monthly assessment tracking, term exam visualization, and subject resource library.";

export const SUBJECT_COMBINATIONS = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    code: "COMB_1_ICT",
    name: "Combination 1",
    displayName: "Accounting + Economics + ICT",
    subjects: ["Accounting", "Economics", "Information & Communication Technology"],
    subjectCodes: ["ACC", "ECON", "ICT"]
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    code: "COMB_2_BS",
    name: "Combination 2",
    displayName: "Accounting + Economics + Business Studies",
    subjects: ["Accounting", "Economics", "Business Studies"],
    subjectCodes: ["ACC", "ECON", "BS"]
  }
];

export const SUBJECTS_MAP = {
  ACC: { id: "11111111-1111-1111-1111-111111111111", code: "ACC", name: "Accounting" },
  ECON: { id: "22222222-2222-2222-2222-222222222222", code: "ECON", name: "Economics" },
  ICT: { id: "33333333-3333-3333-3333-333333333333", code: "ICT", name: "Information & Communication Technology" },
  BS: { id: "44444444-4444-4444-4444-444444444444", code: "BS", name: "Business Studies" }
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const RESOURCE_CATEGORIES = [
  { id: "notes", label: "Lecture Notes" },
  { id: "past_papers", label: "Past Papers" },
  { id: "model_papers", label: "Model Papers" },
  { id: "revision", label: "Revision Materials" },
  { id: "other", label: "Other Documents" }
];
