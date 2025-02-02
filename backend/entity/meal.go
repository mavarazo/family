package entity

import (
	"database/sql"
	"log"
	"time"

	"github.com/guregu/null/v5"
)

type Meal struct {
	ID          int64       `json:"id"`
	CreatedAt   time.Time   `json:"createdAt"`
	ModifiedAt  null.Time   `json:"modifiedAt"`
	Name        string      `json:"name"`
	Link        null.String `json:"link"`
	Description null.String `json:"description"`
}

func (meal *Meal) Insert() (*Meal, error) {
	tx, err := DB.Begin()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	stmt, err := tx.Prepare("INSERT INTO meals (name, link, description) VALUES (?, ?, ?)")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(meal.Name, meal.Link, meal.Description)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	Commit(tx)
	id, _ := result.LastInsertId()
	return FindMealById(id)
}

func (meal *Meal) Update() (*Meal, error) {
	tx, err := DB.Begin()
	if err != nil {
		return nil, err
	}

	stmt, err := tx.Prepare("UPDATE meals SET name = ?, link = ?, description = ? WHERE id = ?")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(meal.Name, meal.Link, meal.Description, meal.ID)
	if err != nil {
		return nil, err
	}

	Commit(tx)
	return FindMealById(meal.ID)
}

func (meal *Meal) Delete() (bool, error) {
	tx, err := DB.Begin()
	if err != nil {
		return false, err
	}

	stmt, err := DB.Prepare("DELETE from meals where id = ?")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(meal.ID)
	if err != nil {
		return false, err
	}

	Commit(tx)
	return true, nil
}

func FindMealById(id int64) (*Meal, error) {
	stmt, err := DB.Prepare("SELECT id, created_at, modified_at, name, link, description from meals WHERE id = ?")
	if err != nil {
		return nil, err
	}

	meal := Meal{}
	err = stmt.QueryRow(id).Scan(&meal.ID, &meal.CreatedAt, &meal.ModifiedAt, &meal.Name, &meal.Link, &meal.Description)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &meal, nil
}

func FindAllMeals() ([]Meal, error) {
	result, err := DB.Query("SELECT id, created_at, modified_at, name, link, description from meals")
	if err != nil {
		return nil, err
	}
	defer result.Close()

	meals := make([]Meal, 0)
	for result.Next() {
		meal := Meal{}
		err = result.Scan(&meal.ID, &meal.CreatedAt, &meal.ModifiedAt, &meal.Name, &meal.Link, &meal.Description)
		if err != nil {
			return nil, err
		}
		meals = append(meals, meal)
	}

	err = result.Err()
	if err != nil {
		return nil, err
	}
	return meals, err
}
