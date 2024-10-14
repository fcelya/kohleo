# Database Schema
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    tier VARCHAR(50) NOT NULL DEFAULT 'free',  -- E.g., 'free', 'premium'
    stripe_customer_id VARCHAR(255) UNIQUE,  -- Unique Stripe customer identifier
    stripe_subscription_id VARCHAR(255) UNIQUE,  -- Unique subscription identifier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diaries (
    diary_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE entries (
    entry_id SERIAL PRIMARY KEY,
    diary_id INT NOT NULL,
    date DATE NOT NULL,  -- Explicit date of the entry
    title VARCHAR(255) NOT NULL,  -- Entry title
    text TEXT NOT NULL,  -- Entry content
    ready_to_compose BOOLEAN DEFAULT FALSE,  -- Indicates if it's ready for LLM formatting
    edited_by_user BOOLEAN DEFAULT FALSE,  -- Tracks whether the user manually edited the entry
    eliminated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_diary FOREIGN KEY (diary_id) REFERENCES diaries (diary_id) ON DELETE CASCADE
);

CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  -- Each chat belongs to a user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,  -- Belongs to a chat session
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('text', 'voice_note')),  
    content TEXT,  -- Stores the text message (nullable for voice notes)
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    edited BOOLEAN DEFAULT FALSE,  -- Tracks if the message was edited
    CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats (chat_id) ON DELETE CASCADE
);

CREATE TABLE voice_notes (
    voice_note_id SERIAL PRIMARY KEY,
    message_id INT NOT NULL,  -- Links to a chat message
    voice_note_url TEXT NOT NULL,  -- URL of the audio file in the bucket
    duration INT NOT NULL CHECK (duration > 0),  -- Duration in seconds
    transcript TEXT,  -- Transcribed text (nullable)
    transcript_edited BOOLEAN DEFAULT FALSE,  -- Was the transcript edited?
    eliminated BOOLEAN DEFAULT FALSE,  -- Flags if the voice note was deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message FOREIGN KEY (message_id) REFERENCES chat_messages (message_id) ON DELETE CASCADE
);
