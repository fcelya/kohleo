# KohLeo v0.1
KohLeo is a diary app that lazily allows anyone to record their life in order to help them better understand their past, present and future. It is based on voice note led entry creation, leveraging speech-to-text and LLMs to generate easy to read, insightful diary entries based on chaotic voice notes. 

## File structure
- `documentation/`: All of the documentation needed to understand the app is in this folder. Subfolders and subfiles are:
  - `api-documentation.md`: Contains information regarding all endpoints in the backend and the indicatinos needed for communication between front and backend.
  - `database-schema.md`: Contains creation script for all tables available in the relational databse used by the app. 
  - `functional-requirements.md`: Contains information regarding all needed functionality in the current version of the app.
  - `ux-guidelines.md`: Contains the general guidelines for the ux and ui of the app.
  - `screens/`: Contains wireframes for all screens in the app.
- `assets/`: Contains assets used throughout the app like the logo.

## Roadmap
Current version is v0.1.
- v0.2
  - Chat feature (maybe in v0.1?)
  - Search feature
  - Automatic entry title creation
- v0.3
  - Capability of adding written notes as composing information appart from audios
  - Capability of seeing and editing transcripts
- v0.4
  - Immitating sample writing styles
- v0.5 
  - Adding images with automatic positioning within the diary entry (?) / automatic captioning (?)
- v0.6
  - Adding statistics
    - Streak
    - Written days
    - Avg audio length
    - Total written words
    - ...
- v0.7
  - Creation and editing of different diaries
- v0.8
  - Password/biometric protection of certain diaries