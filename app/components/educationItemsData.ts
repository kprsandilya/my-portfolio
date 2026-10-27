// Course highlights for each year, taken from the Purdue transcript.

// Course cards are tinted with the three theme accents (see globals.css).
const TINT = (accent: string) => `color-mix(in srgb, var(${accent}) 18%, var(--pf-raised))`;

// Cards cycle through these so neighboring courses look different.
const CARD_STYLES = [TINT('--pf-accent'), TINT('--pf-accent-2'), TINT('--pf-accent-3')];

interface Course {
  courseName: string;
  courseTitle: string;
  grade: string;
}

const withStyles = (courses: Course[]) =>
  courses.map((course, i) => ({ ...course, css: CARD_STYLES[i % CARD_STYLES.length] }));

// Freshman year: Summer 2023 through Spring 2024
const list1 = withStyles([
  { courseName: 'CS 18000', courseTitle: 'Problem Solving and Object-Oriented Programming', grade: 'A' },
  { courseName: 'CS 18200', courseTitle: 'Foundations of Computer Science', grade: 'A-' },
  { courseName: 'CS 24000', courseTitle: 'Programming in C', grade: 'A' },
  { courseName: 'MA 27101', courseTitle: 'Honors Multivariate Calculus', grade: 'A' },
  { courseName: 'MA 35100', courseTitle: 'Elementary Linear Algebra', grade: 'A+' },
  { courseName: 'CS 38003', courseTitle: 'Python Programming', grade: 'A' },
]);

// Sophomore year: Fall 2024 and Spring 2025
const list2 = withStyles([
  { courseName: 'CS 25000', courseTitle: 'Computer Architecture', grade: 'A+' },
  { courseName: 'CS 25100', courseTitle: 'Data Structures and Algorithms', grade: 'A-' },
  { courseName: 'CS 25200', courseTitle: 'Systems Programming', grade: 'A+' },
  { courseName: 'CS 24200', courseTitle: 'Introduction to Data Science', grade: 'A' },
  { courseName: 'STAT 35500', courseTitle: 'Statistics for Data Science', grade: 'A+' },
  { courseName: 'HONR 29900', courseTitle: 'C3 Game Jam', grade: 'A' },
]);

// Junior year: Fall 2025 and Spring 2026
const list3 = withStyles([
  { courseName: 'CS 38100', courseTitle: 'Introduction to the Analysis of Algorithms', grade: 'A' },
  { courseName: 'CS 47100', courseTitle: 'Introduction to Artificial Intelligence', grade: 'A' },
  { courseName: 'CS 37300', courseTitle: 'Data Mining and Machine Learning', grade: 'A+' },
  { courseName: 'STAT 41600', courseTitle: 'Probability', grade: 'A' },
  { courseName: 'STAT 41700', courseTitle: 'Statistical Theory', grade: 'A+' },
  { courseName: 'MGMT 39000', courseTitle: 'Healthcare Operations', grade: 'A' },
]);

// Senior year: Fall 2026 (in progress, so no grades yet)
const list4 = withStyles([
  { courseName: 'CS 58000', courseTitle: 'Algorithm Design, Analysis, and Implementation (in progress)', grade: '—' },
  { courseName: 'CS 58100', courseTitle: 'Algorithmic Game Theory (in progress)', grade: '—' },
  { courseName: 'CS 44000', courseTitle: 'Large Scale Data Analytics (in progress)', grade: '—' },
  { courseName: 'STAT 51200', courseTitle: 'Applied Regression Analysis (in progress)', grade: '—' },
  { courseName: 'COM 21700', courseTitle: 'Honors Scientific Writing and Presentation (in progress)', grade: '—' },
]);

export default {
  1: list1,
  2: list2,
  3: list3,
  4: list4,
}
