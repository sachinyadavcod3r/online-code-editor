# Online Code Editor — Project Context

## Overview
A full-stack online code editor with authentication, project saving, and cloud deployment.

## Tech Stack
Frontend:
- HTML, CSS, JavaScript
- CodeMirror (via CDN)
- Bootstrap
- Dynamic navbar + sidebar (layout.js)

Backend:
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication (cookies)
- compilex for local code execution

Deployment:
- Render (Web Service)
- MongoDB Atlas
- GitHub CI/CD

## Core Features
- Multi-language editor (C++, Java, Python)
- Python execution enabled in production
- C++/Java disabled in production intentionally (sandbox limitation)
- Save / rename / delete projects (MongoDB)
- Login / register / logout / delete account
- Sidebar navigation consistent before & after login
- Dark / light theme
- IO panel toggle

## Architecture Decisions
- CodeMirror loaded via CDN (to avoid MIME & static serving issues)
- layout.js injects navbar & sidebar dynamically
- editor.js exposes initEditorUI() to bind buttons after layout injection
- Production-safe execution logic
- Environment variables via .env
- Nodemon for development

## Known Constraints
- Native languages disabled in production
- Python execution only
- Render free tier limitations

## Repo
https://github.com/sachinyadavcod3r/online-code-editor

## Deployment
https://online-code-editor-x9h4.onrender.com
