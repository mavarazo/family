-- +goose Up
CREATE TABLE mealdates (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_at TIMESTAMP,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    meal_id INTEGER,
    FOREIGN KEY (meal_id) REFERENCES meals (meal_id)
);

-- +goose StatementBegin
CREATE TRIGGER update_mealdate_modified
AFTER UPDATE ON mealdates
BEGIN
   UPDATE mealdates SET modified_at = current_timestamp WHERE id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TABLE mealdates;