USE appdb;

SET FOREIGN_KEY_CHECKS=0;

-- Reset test data
TRUNCATE TABLE task_tags;
TRUNCATE TABLE project_tasks;
TRUNCATE TABLE tags;
TRUNCATE TABLE tasks;
TRUNCATE TABLE projects;

SET FOREIGN_KEY_CHECKS=1;

-- Projects
INSERT INTO projects (id, name, budget, description, hours_used) VALUES
(1, 'Website Redesign', 50000, 'Refresh marketing site and landing pages.', 120),
(2, 'Mobile App MVP', 90000, 'Build first iOS/Android release.', 260),
(3, 'Internal Admin Tool', 30000, 'Operations dashboard for support team.', 80);

-- Tasks
INSERT INTO tasks (id, title, description, hours) VALUES
(1, 'Design home page', 'Create hero, sections, and responsive layout for the homepage.', 12),
(2, 'Build login API', 'Implement login endpoint with credential validation and token issue.', 16),
(3, 'Implement auth middleware', 'Protect private routes by verifying auth tokens.', 10),
(4, 'Create CI pipeline', 'Set up automated build and test workflow in CI.', 8),
(5, 'Write integration tests', 'Cover API and DB integration flows with test cases.', 14),
(6, 'Add billing screen', 'Implement UI and API integration for billing management.', 20),
(7, 'Set up error tracking', 'Configure centralized error logging and alerting.', 6);

-- Junction table: connect projects to tasks
INSERT INTO project_tasks (project_id, task_id) VALUES
(1, 1),
(1, 2),
(1, 5),
(2, 2),
(2, 3),
(2, 6),
(3, 4),
(3, 7);

-- Tags (must exist before task_tags references them)
INSERT INTO tags (id, name) VALUES
(1, 'frontend'),
(2, 'backend'),
(3, 'devops'),
(4, 'testing'),
(5, 'urgent'),
(6, 'feature')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Junction table: connect tasks to tags
INSERT INTO task_tags (task_id, tag_id) VALUES
(1, 1),  -- task 1: frontend
(1, 6),  -- task 1: feature
(2, 2),  -- task 2: backend
(2, 5),  -- task 2: urgent
(3, 2),  -- task 3: backend
(4, 3),  -- task 4: devops
(5, 4),  -- task 5: testing
(6, 1),  -- task 6: frontend
(6, 6),  -- task 6: feature
(7, 3);  -- task 7: devops

-- Quick check query
SELECT t.id, t.title, t.description, t.hours, GROUP_CONCAT(g.name ORDER BY g.name) AS tags
FROM tasks t
LEFT JOIN task_tags tt ON tt.task_id = t.id
LEFT JOIN tags g ON g.id = tt.tag_id
GROUP BY t.id, t.title, t.description, t.hours
ORDER BY t.id;

SELECT p.id, p.name, GROUP_CONCAT(t.title ORDER BY t.id SEPARATOR ' | ') AS tasks
FROM projects p
LEFT JOIN project_tasks pt ON pt.project_id = p.id
LEFT JOIN tasks t ON t.id = pt.task_id
GROUP BY p.id, p.name
ORDER BY p.id;
