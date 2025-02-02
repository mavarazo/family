-- +goose Up
CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_at TIMESTAMP,
    name TEXT NOT NULL,
    link TEXT,
    description TEXT
);

-- +goose StatementBegin
CREATE TRIGGER update_meal_modified
AFTER UPDATE ON meals
BEGIN
   UPDATE meals SET modified_at = current_timestamp WHERE id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE meals;