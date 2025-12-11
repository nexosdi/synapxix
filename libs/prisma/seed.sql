/*
--docker exec -it postgres_shared psql -U postgres -d mi_base
p/insertar:
--Get-Content C:\dev\synapxix\synapxix\prisma\seed.sql | docker exec -i postgres_shared psql -U postgres -d mi_base 

*/
--set search path
SET search_path TO core, auth, psychometrics, knowledge, communication, audit;

--institution
INSERT INTO core.institution (institution_id, name, description, created_at)
VALUES (gen_random_uuid(), 'Escuela Primaria Nº 125', 'Institución educativa modelo para pruebas del sistema.', now());

----structure
INSERT INTO core.structure (structure_id, institution_id, name, parent_id, description, created_at)
VALUES (
  gen_random_uuid(),
  (SELECT institution_id FROM core.institution WHERE name = 'Escuela Primaria Nº 125' LIMIT 1),
  '2do Grado - Curso A',
  NULL,
  'Curso de prueba para demo.',
  now()
);

--users
INSERT INTO auth.app_user (user_id, username, email, firstname, lastname, role, created_at, active)
SELECT gen_random_uuid(),
       'alumno' || s.i,
       'alumno' || s.i || '@escuela125.edu.ar',
       'Alumno' || s.i,
       'Demo',
       'student',
       now(),
       true
FROM generate_series(1,20) AS s(i);

--user structure assignment
INSERT INTO auth.user_structure (user_id, structure_id)
SELECT u.user_id, st.structure_id
FROM auth.app_user u
CROSS JOIN core.structure st
WHERE st.name = '2do Grado - Curso A' AND u.username LIKE 'alumno%';


--user links enum linktype!!!
-- admin -> jlopez (DIRECTOR supervisa TEACHER)
INSERT INTO auth.user_link (link_id, id_user_from, id_user_to, link_type)
SELECT
  uuid_generate_v4(),
  (SELECT user_id FROM auth.app_user WHERE username = 'admin'),
  (SELECT user_id FROM auth.app_user WHERE username = 'jlopez'),
  'DIRECTOR';

-- jlopez -> mgarcia (TEACHER de STUDENT)
INSERT INTO auth.user_link (link_id, id_user_from, id_user_to, link_type)
SELECT
  uuid_generate_v4(),
  (SELECT user_id FROM auth.app_user WHERE username = 'jlopez'),
  (SELECT user_id FROM auth.app_user WHERE username = 'mgarcia'),
  'TEACHER';

---dimensions

INSERT INTO psychometrics.dimension (dimension_id, name)
VALUES
  (uuid_generate_v4(), 'Personalidad'),
  (uuid_generate_v4(), 'Cognitiva');

--archetypes
INSERT INTO psychometrics.archetype (archetype_id, dimension_id, name, description)
VALUES
  (gen_random_uuid(), NULL, 'Razonamiento lógico', 'Arquetipo de razonamiento lógico.'),
  (gen_random_uuid(), NULL, 'Creatividad', 'Arquetipo de creatividad.'),
  (gen_random_uuid(), NULL, 'Pensamiento crítico', 'Arquetipo de pensamiento crítico.'),
  (gen_random_uuid(), NULL, 'Resolución de problemas', 'Arquetipo de resolución de problemas.'),
  (gen_random_uuid(), NULL, 'Inteligencia emocional', 'Arquetipo de inteligencia emocional.');

---content

INSERT INTO knowledge.content (content_id, title, description)
VALUES
  (uuid_generate_v4(), 'Introducción al Sistema', 'Primer contenido básico'),
  (uuid_generate_v4(), 'Fundamentos Generales', 'Segundo contenido básico');

---user content progress

INSERT INTO knowledge.user_content_progress (user_id, content_id, completed, progress)
SELECT
  (SELECT user_id FROM auth.app_user WHERE username = 'mgarcia'),
  (SELECT content_id FROM knowledge.content WHERE title = 'Introducción al Sistema'),
  false, 0.3;

---notifications
INSERT INTO communication.notification (notification_id, user_id, title, message)
SELECT
  uuid_generate_v4(),
  (SELECT user_id FROM auth.app_user WHERE username = 'admin'),
  'Bienvenido',
  'Gracias por usar la plataforma';

--audit logs
INSERT INTO audit.audit_log (audit_id, user_id, table_name, record_id)
SELECT
  uuid_generate_v4(),
  (SELECT user_id FROM auth.app_user WHERE username = 'admin'),
  'app_user',
  (SELECT user_id FROM auth.app_user WHERE username = 'admin');

-- Requiere la extensión pgcrypto (para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--institution and structure
INSERT INTO core.institution (institution_id, name, description, created_at)
VALUES (gen_random_uuid(), 'Escuela Primaria Nº 125', 'Institución educativa modelo para pruebas del sistema.', now());

INSERT INTO core.structure (structure_id, institution_id, name, parent_id, description, created_at)
VALUES (
  gen_random_uuid(),
  (SELECT institution_id FROM core.institution WHERE name = 'Escuela Primaria Nº 125' LIMIT 1),
  '2do Grado - Curso A',
  NULL,
  'Curso de prueba para demo.',
  now()
);

-- archetypes (psychometrics.archetype)
INSERT INTO psychometrics.archetype (archetype_id, dimension_id, name, description)
VALUES
  (gen_random_uuid(), NULL, 'Razonamiento lógico', 'Arquetipo de razonamiento lógico.'),
  (gen_random_uuid(), NULL, 'Creatividad', 'Arquetipo de creatividad.'),
  (gen_random_uuid(), NULL, 'Pensamiento crítico', 'Arquetipo de pensamiento crítico.'),
  (gen_random_uuid(), NULL, 'Resolución de problemas', 'Arquetipo de resolución de problemas.'),
  (gen_random_uuid(), NULL, 'Inteligencia emocional', 'Arquetipo de inteligencia emocional.');

-- 20 alumnos (auth.app_user) — ajustado a las columnas presentes en el schema
INSERT INTO auth.app_user (user_id, username, email, firstname, lastname, role, created_at, active)
SELECT gen_random_uuid(),
       'alumno' || s.i,
       'alumno' || s.i || '@escuela125.edu.ar',
       'Alumno' || s.i,
       'Demo',
       'student',
       now(),
       true
FROM generate_series(1,20) AS s(i);

--vincular cada alumno con la estructura (user_structure)
INSERT INTO auth.user_structure (user_id, structure_id)
SELECT u.user_id, st.structure_id
FROM auth.app_user u
CROSS JOIN core.structure st
WHERE st.name = '2do Grado - Curso A' AND u.username LIKE 'alumno%';

-- progreso aleatorio por alumno x arquetipo
INSERT INTO psychometrics.user_archetype_progress (user_id, archetype_id, score, last_update)
SELECT u.user_id, a.archetype_id, round(random() * 100.0::numeric, 2), now()
FROM auth.app_user u
JOIN psychometrics.archetype a ON true
WHERE u.username LIKE 'alumno%';
