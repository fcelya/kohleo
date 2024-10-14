# Functional requirements
This document outlines the main functionalities required in the current version of the app

1. Login
- Users must be able to log in. Once they are logged in, only the information regarding that user can be displayed, no other diaries, audios, etc.

2. Entry creation and editing
- Users must be able to create diary entries with their chosen name.
- Users must be able to visualize all entries.
- Users must be able to eliminate entries.
- Users must be able to eliminate entries. 

3. Content adding
- For any given entry users must be able to add inforamtion in a chat interface
- Users must be able to record audios. 
- Users must be able to send text messages.

4. Automatic entry composing
- Users must be able to automatically compose the written diary entry once at least one piece of information is added. 
- Compose is only available if any audio notes have been added, edited or eliminated since the last compose. This is signaled through the `ready_to_compose` column in the `entries` table. 
- Users must be able to recompose an written diary entry. The composing engine must take into account what the previously written diary entry was and what audio and written information it had at the moment. The composing engine must make changes exclusively regarding the change in available information (i.e. don't overwrite previous handmade edits)