# Database Schema

## users

- id
- name
- email
- hashed_password
- role: candidate/company
- company_name
- created_at

## jobs

- id
- title
- location
- job_type
- description
- salary_range
- owner_id → users.id
- created_at

## applications

- id
- candidate_id → users.id
- job_id → jobs.id
- cover_letter
- status
- created_at

Relationships:

- One company user can create many jobs.
- One candidate user can submit many applications.
- One job can receive many applications.
- One candidate can apply once per job.
