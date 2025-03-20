export const Genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

export const MonthOptions = [
  { label: 'Jan - 01', value: 1 },
  { label: 'Feb - 02', value: 2 },
  { label: 'Mar - 03', value: 3 },
  { label: 'Apr - 04', value: 4 },
  { label: 'May - 05', value: 5 },
  { label: 'June - 06', value: 6 },
  { label: 'July - 07', value: 7 },
  { label: 'Aug - 08', value: 8 },
  { label: 'Sep - 09', value: 9 },
  { label: 'Oct - 10', value: 10 },
  { label: 'Nov - 11', value: 11 },
  { label: 'Dec - 12', value: 12 }
];

export const DayOptions = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));

export const YearOptions = Array.from(
  { length: 100 }, 
  (_, i) => ({ label: (new Date().getFullYear() - i).toString(), value: new Date().getFullYear() - i })
);

export const CitizenshipOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Belarus', value: 'BL' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Australia', value: 'AU' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'China', value: 'CN' },
  { label: 'India', value: 'IN' },
  { label: 'Brazil', value: 'BR' },
];