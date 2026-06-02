-- Fix: grant service_role permission to use contact_messages_id_seq
-- Error 42501: permission denied for sequence

-- Grant usage on the sequence to service_role
GRANT USAGE, SELECT ON SEQUENCE contact_messages_id_seq TO service_role;

-- Also ensure the table itself has proper grants
GRANT ALL ON contact_messages TO service_role;

-- If the above doesn't work, the sequence may have wrong ownership.
-- Reassign ownership to the role that owns the table:
ALTER SEQUENCE contact_messages_id_seq OWNED BY contact_messages.id;
