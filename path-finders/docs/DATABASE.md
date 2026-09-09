# Database overview

`profiles` stores student profile information and the authenticated user ID. `subjects` and `subject_combinations` normalize academic choices. `combination_subjects` maps combinations to subjects.

`assessments` defines flexible monthly assessments, while `assessment_results` stores one student's result per assessment. `examinations` supports any number of term/exam records instead of hard-coding four. `examination_results` stores subject-level results.

`resources` and `resource_categories` provide a database-managed library. `admin_roles` provides role-based admin permissions. `audit_logs` is intended for controlled tracking of sensitive changes.
