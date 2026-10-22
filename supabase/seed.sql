insert into public.skill_categories (name, slug, description, sort_order) values
  ('Software & Web', 'software-web', 'Create software and experiences for the web.', 1),
  ('Data & AI', 'data-ai', 'Explore data, analysis, and responsible artificial intelligence.', 2),
  ('Design & Creativity', 'design-creativity', 'Understand people and shape useful digital experiences.', 3),
  ('Cybersecurity & IT', 'cybersecurity-it', 'Help protect systems and support reliable technology.', 4),
  ('Cloud & Infrastructure', 'cloud-infrastructure', 'Build and operate modern digital infrastructure.', 5),
  ('Digital Business', 'digital-business', 'Use digital tools to help ideas and organisations grow.', 6)
on conflict (slug) do nothing;

insert into public.skills (category_id, slug, title, summary, description, difficulty, estimated_commitment, is_published)
select c.id, v.slug, v.title, v.summary, v.description, v.difficulty, v.commitment, true
from (values
  ('software-web', 'frontend-development', 'Frontend development', 'Build interfaces with HTML, CSS, JavaScript, and modern frameworks.', 'Explore the work of building accessible web interfaces.', 'beginner', '6–9 months'),
  ('software-web', 'backend-development', 'Backend development', 'Design APIs, data models, and services behind applications.', 'Explore server-side application development.', 'beginner', '8–12 months'),
  ('design-creativity', 'ui-ux-design', 'UI/UX design', 'Research user needs and shape accessible digital experiences.', 'Explore user-centred design practice.', 'beginner', '4–7 months'),
  ('data-ai', 'data-analysis', 'Data analysis', 'Use spreadsheets, SQL, and visualisation to answer questions with data.', 'Explore practical data analysis.', 'beginner', '4–8 months'),
  ('cybersecurity-it', 'cybersecurity', 'Cybersecurity', 'Learn defensive security fundamentals and help protect systems.', 'Explore responsible, defensive security work.', 'beginner', '8–12 months'),
  ('cloud-infrastructure', 'cloud-computing', 'Cloud computing', 'Understand cloud platforms, networking, and reliable infrastructure.', 'Explore cloud and infrastructure fundamentals.', 'intermediate', '6–10 months'),
  ('software-web', 'mobile-development', 'Mobile development', 'Create useful apps for phones and tablets.', 'Explore mobile application development.', 'intermediate', '6–10 months'),
  ('digital-business', 'digital-marketing', 'Digital marketing', 'Plan ethical campaigns and measure audience engagement.', 'Explore digital marketing fundamentals.', 'beginner', '3–6 months')
) as v(category_slug, slug, title, summary, description, difficulty, commitment)
join public.skill_categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

insert into public.learning_paths (slug, title, description, difficulty, estimated_duration, access_level, is_published) values
  ('web-development-foundations', 'Web development foundations', 'Go from your first line of HTML to publishing a responsive, accessible website.', 'beginner', '12 weeks', 'free', true),
  ('data-analysis-starter', 'Data analysis starter', 'Ask better questions, work with tidy datasets, and communicate findings with confidence.', 'beginner', '10 weeks', 'free', true),
  ('product-design-basics', 'Product design basics', 'Explore a user-centred design process and make a thoughtful prototype.', 'beginner', '8 weeks', 'free', true),
  ('cybersecurity-first-steps', 'Cybersecurity first steps', 'Build safe, defensive security habits and learn the language of digital protection.', 'beginner', '10 weeks', 'free', true),
  ('backend-api-fundamentals', 'Backend and API fundamentals', 'Understand how servers, APIs, and databases support modern applications.', 'beginner', '12 weeks', 'free', true),
  ('cloud-computing-essentials', 'Cloud computing essentials', 'Learn the building blocks behind cloud platforms, deployment, and reliability.', 'intermediate', '9 weeks', 'free', true)
on conflict (slug) do nothing;

insert into public.learning_path_skills (learning_path_id, skill_id)
select p.id, s.id from (values
  ('web-development-foundations', 'frontend-development'),
  ('data-analysis-starter', 'data-analysis'),
  ('product-design-basics', 'ui-ux-design'),
  ('cybersecurity-first-steps', 'cybersecurity'),
  ('backend-api-fundamentals', 'backend-development'),
  ('cloud-computing-essentials', 'cloud-computing')
) as v(path_slug, skill_slug)
join public.learning_paths p on p.slug = v.path_slug
join public.skills s on s.slug = v.skill_slug
on conflict do nothing;

insert into public.modules (learning_path_id, title, description, sort_order, is_published)
select p.id, v.title, 'A practical module in the ' || p.title || ' learning path.', v.sort_order, true
from (values
  ('web-development-foundations', 'How the web works', 1), ('web-development-foundations', 'Structure and style', 2), ('web-development-foundations', 'Make it interactive', 3), ('web-development-foundations', 'Build and share', 4),
  ('data-analysis-starter', 'Think with data', 1), ('data-analysis-starter', 'Query and explore', 2), ('data-analysis-starter', 'Tell the story', 3),
  ('product-design-basics', 'Understand people', 1), ('product-design-basics', 'Shape an idea', 2), ('product-design-basics', 'Test and improve', 3),
  ('cybersecurity-first-steps', 'Security mindset', 1), ('cybersecurity-first-steps', 'Systems and networks', 2), ('cybersecurity-first-steps', 'Defend and communicate', 3),
  ('backend-api-fundamentals', 'Server-side thinking', 1), ('backend-api-fundamentals', 'Work with data', 2), ('backend-api-fundamentals', 'Build responsibly', 3),
  ('cloud-computing-essentials', 'Cloud concepts', 1), ('cloud-computing-essentials', 'Deploy thoughtfully', 2), ('cloud-computing-essentials', 'Operate reliably', 3)
) as v(path_slug, title, sort_order)
join public.learning_paths p on p.slug = v.path_slug
on conflict (learning_path_id, sort_order) do nothing;

insert into public.lessons (module_id, slug, title, summary, content_markdown, estimated_minutes, is_preview, is_published, sort_order)
select m.id, v.slug, v.title, 'An introduction to ' || lower(v.title) || '.', '# ' || v.title || E'\n\n' || v.lesson_body || E'\n\n## Try it\n' || v.activity, 20, true, true, v.lesson_order
from (values
  ('How the web works', 'internet-and-web', 'The internet and the web', 1, $lesson$The internet connects networks and devices. The web is one service that uses that connection: browsers request documents and servers respond, commonly using HTTP. A URL identifies where a resource can be found.$lesson$, 'Sketch what happens between entering a web address and seeing a page.'),
  ('How the web works', 'workspace-setup', 'Set up your workspace', 2, $lesson$A code editor helps you create and organise files; a browser lets you inspect the result. Keep project files together and choose names that describe their purpose. You can begin with a plain text editor and a browser.$lesson$, 'Create a project folder and list the files you would need for a one-page site.'),
  ('How the web works', 'first-html-page', 'Your first HTML page', 3, $lesson$HTML gives a document its structure and meaning. A page starts with a doctype and an html element; the head contains page information, while the body contains visible content. Headings, paragraphs, and links should describe what each piece is for.$lesson$, 'Write a page with one descriptive heading, a short paragraph, and a link with meaningful text.'),
  ('Structure and style', 'semantic-html', 'Semantic HTML', 1, $lesson$Semantic elements describe a page region or content role. A main element identifies the central content; nav groups important navigation links; headings communicate an outline. Good structure helps people and assistive technology understand a page.$lesson$, 'Review a page outline and choose appropriate heading levels without skipping for visual size.'),
  ('Structure and style', 'css-fundamentals', 'CSS fundamentals', 2, $lesson$CSS rules match selectors to elements and apply declarations such as color, spacing, and type size. The cascade resolves competing rules using origin, importance, specificity, and source order. Prefer clear selectors and consistent spacing over repeated overrides.$lesson$, 'Style a heading and paragraph, then inspect which rule wins when two selectors conflict.'),
  ('Structure and style', 'responsive-layouts', 'Responsive layouts', 3, $lesson$Responsive layouts adapt to available space instead of assuming one screen size. Flexible widths, wrapping layouts, and media queries can help content reflow. A page should remain readable and operable at narrow widths without horizontal scrolling.$lesson$, 'Resize a page from desktop to phone width and note where its layout needs to change.'),
  ('Think with data', 'questions-and-evidence', 'Questions and evidence', 1, $lesson$Analysis starts with a clear question. Identify what evidence could answer it, what the dataset represents, and what it cannot show. A pattern is not automatically an explanation, and an association alone does not prove cause.$lesson$, 'Write one question for a public dataset and list two limits of the evidence it could provide.'),
  ('Think with data', 'data-quality', 'Data types and quality', 2, $lesson$Rows and columns are easier to analyse when each field has a consistent meaning and type. Look for missing values, duplicates, inconsistent units, and unexpected categories before calculating a result. Record transformations so another person can follow the work.$lesson$, 'Inspect a small table and note one data-quality issue before changing any values.'),
  ('Understand people', 'design-problems', 'What product design solves', 1, $lesson$Product design connects user needs, organisational goals, and technical constraints. Begin by understanding the situation rather than assuming a solution. A useful problem statement describes who is affected, what they are trying to do, and where friction appears.$lesson$, 'Rewrite a feature idea as a problem statement without prescribing a solution.'),
  ('Understand people', 'user-interviews', 'Interview with care', 2, $lesson$An interview can reveal how someone approaches a task and what they find difficult. Ask open questions about past behaviour, avoid leading language, and explain how notes will be used. A small number of conversations offers clues, not a statistical portrait of everyone.$lesson$, 'Draft three neutral questions about how someone currently completes a familiar task.'),
  ('Security mindset', 'threats-and-risk', 'Threats and risk', 1, $lesson$Security work considers assets, possible threats, weaknesses, and likely impact. Risk helps teams prioritise safeguards; it is not a promise that every threat can be removed. Scope and permission matter: only assess systems you own or are explicitly authorised to test.$lesson$, 'For a personal account, identify one asset, one plausible risk, and one defensive safeguard.'),
  ('Security mindset', 'account-safety', 'Protect personal accounts', 2, $lesson$Unique passwords reduce the impact when another service is breached. A password manager can help create and store them, while multi-factor authentication adds another verification step. Be cautious with unexpected sign-in links and review recovery options.$lesson$, 'Make a defensive checklist for securing one account you own; do not test anyone else’s account.'),
  ('Server-side thinking', 'requests-responses', 'Requests and responses', 1, $lesson$A client sends a request to a server and receives a response. Requests include a method and a resource path; responses include a status code and may include data. Separating these concerns helps an API communicate success and failure clearly.$lesson$, 'Describe a request and response for reading one item from a reading list.'),
  ('Server-side thinking', 'http-practice', 'HTTP in practice', 2, $lesson$HTTP methods express intended operations: GET reads, POST creates, and PUT or PATCH updates. Status codes communicate broad outcomes, such as a successful response or a missing resource. Validate input on the server and return only data the caller is allowed to see.$lesson$, 'Choose an HTTP method and a success or error status for three basic API actions.'),
  ('Cloud concepts', 'cloud-services', 'What cloud services provide', 1, $lesson$Cloud services provide computing resources over a network, often with flexible capacity and managed components. Choosing a service involves trade-offs in control, cost, reliability, and operational responsibility. Cloud does not remove the need to secure and monitor an application.$lesson$, 'List which parts of a small web service you would want to manage yourself and which you might use as a managed service.'),
  ('Cloud concepts', 'regions-availability', 'Regions and availability', 2, $lesson$Cloud providers group infrastructure into regions and availability zones. Placement affects latency, resilience, legal requirements, and cost. A design should identify which failures it needs to tolerate rather than assuming a provider is always available.$lesson$, 'Draw a simple service layout and mark one component whose failure could interrupt it.')
) as v(module_title, slug, title, lesson_order, lesson_body, activity)
join public.modules m on m.title = v.module_title
on conflict (module_id, slug) do nothing;

insert into public.projects (slug, title, category_id, difficulty, description, expected_outcome, estimated_effort, required_skills, learning_objectives, is_published)
select v.slug, v.title, c.id, v.difficulty, v.description, v.outcome, v.effort, v.skills, v.objectives, true
from (values
  ('personal-portfolio', 'A personal portfolio that tells your story', 'software-web', 'beginner', 'Create an accessible portfolio site with a clear introduction, selected work, and contact details.', 'A published portfolio you can keep improving.', '1–2 weeks', array['HTML','CSS','Responsive design'], array['Structure a simple website','Use responsive design','Review accessibility']),
  ('community-data-story', 'A community data story', 'data-ai', 'beginner', 'Choose a public dataset, ask a focused question, and explain one useful finding with a chart.', 'A short, evidence-led case study.', '1 week', array['Spreadsheets','Data cleaning','Visualisation'], array['Ask a clear question','Represent a finding honestly']),
  ('accessible-signup-flow', 'An accessible sign-up flow', 'design-creativity', 'beginner', 'Design and test a simple account creation journey, including clear form feedback.', 'A prototype with documented usability improvements.', '1–2 weeks', array['User research','Wireframes','Accessibility'], array['Design understandable forms','Test a prototype with care']),
  ('security-habits-guide', 'A practical security habits guide', 'cybersecurity-it', 'beginner', 'Create a plain-language guide to safer account and device practices for a chosen audience.', 'A useful defensive security checklist.', '3–5 days', array['Threat awareness','Research','Communication'], array['Explain defensive practices','Communicate risk clearly']),
  ('api-reading-list', 'A small reading-list API', 'software-web', 'intermediate', 'Plan an API for saving and organising reading links, with validation and clear error responses.', 'A documented API design or working prototype.', '2–3 weeks', array['HTTP','Data modelling','Testing'], array['Model data','Design consistent API responses'])
) as v(slug, title, category_slug, difficulty, description, outcome, effort, skills, objectives)
join public.skill_categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
