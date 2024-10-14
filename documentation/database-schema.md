# Database Schema
-- 1. Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    tier VARCHAR(50) NOT NULL DEFAULT 'free',  -- E.g., 'free', 'premium'
    stripe_customer_id VARCHAR(255) UNIQUE,  -- Unique Stripe customer identifier
    stripe_subscription_id VARCHAR(255) UNIQUE,  -- Unique subscription identifier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Diaries Table
CREATE TABLE diaries (
    diary_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- 3. Entries Table
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

-- 4. Voice Notes Table
CREATE TABLE voice_notes (
    voice_note_id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    voice_note_url TEXT NOT NULL,  -- URL to the audio file in a bucket
    duration INT NOT NULL CHECK (duration > 0),  -- Duration in seconds, must be positive
    transcript TEXT,  -- Text version of the audio
    transcript_edited BOOLEAN DEFAULT FALSE,  -- Tracks if transcript was edited by user
    eliminated BOOLEAN DEFAULT FALSE,  -- Flags if the voice note was removed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_entry FOREIGN KEY (entry_id) REFERENCES entries (entry_id) ON DELETE CASCADE
);
