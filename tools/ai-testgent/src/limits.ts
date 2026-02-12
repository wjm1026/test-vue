/**
 * Centralized limits for AI TestGent context windows.
 *
 * These values control how much data is sent to the LLM at each stage.
 * Increase if your LLM supports a large context window (e.g. Gemini Pro 1M+).
 * Decrease if you hit token limits or response quality degrades.
 */

// ── Stage 1: Context collection ──────────────────────────────────────

/** Maximum number of changed files to analyse. */
export const MAX_CHANGED_FILES = 40

/** Maximum number of existing test files used as style examples. */
export const MAX_TEST_EXAMPLES = 5

/** Per-file: max lines of full source content kept for LLM. */
export const FILE_FULL_CONTENT_LINES = 1500

/** Per-file: max lines of git diff patch kept. */
export const FILE_DIFF_PATCH_LINES = 400

/** Per-file: max lines of the contextual snippet around changes. */
export const FILE_SNIPPET_LINES = 500

/** Per-file: context lines before/after each diff hunk when building snippet. */
export const SNIPPET_HUNK_PADDING = 30

/** Per test-example file: max lines of content. */
export const TEST_EXAMPLE_CONTENT_LINES = 400

// ── Stage 2: Test plan ───────────────────────────────────────────────

/** Max test cases accepted from LLM response. */
export const PLAN_MAX_TEST_CASES = 80

/** Max changed files considered for heuristic plan generation. */
export const PLAN_HEURISTIC_MAX_FILES = 25

// ── Stage 3: Fix (compact input) ─────────────────────────────────────

/** Max changed files forwarded to the fix prompt. */
export const FIX_MAX_CHANGED_FILES = 25

/** Fix stage: per-file diffPatch truncation. */
export const FIX_DIFF_PATCH_LINES = 300

/** Fix stage: per-file snippet truncation. */
export const FIX_SNIPPET_LINES = 300

/** Fix stage: per-file fullContent truncation. */
export const FIX_FULL_CONTENT_LINES = 600

/** Fix stage: max test examples forwarded. */
export const FIX_MAX_TEST_EXAMPLES = 5

/** Fix stage: per test-example content truncation. */
export const FIX_TEST_EXAMPLE_CONTENT_LINES = 260

/** Fix stage: max test cases forwarded. */
export const FIX_MAX_TEST_CASES = 40

/** Fix stage: max generated test files forwarded. */
export const FIX_MAX_GENERATED_FILES = 20

/** Fix stage: per generated test file content truncation. */
export const FIX_GENERATED_FILE_CONTENT_LINES = 400

/** Fix stage: stdout truncation. */
export const FIX_STDOUT_LINES = 300

/** Fix stage: stderr truncation. */
export const FIX_STDERR_LINES = 300

// ── Stage 4: Report ──────────────────────────────────────────────────

/** Max test cases displayed in the markdown report. */
export const REPORT_MAX_TEST_CASES = 40

/** Max lines of test output shown in the markdown report. */
export const REPORT_TAIL_OUTPUT_LINES = 60
