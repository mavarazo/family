package entity

import (
	"database/sql"
	"log"
	"time"

	"github.com/guregu/null/v5"
)

type Mealdate struct {
	ID         int64       `json:"id"`
	CreatedAt  time.Time   `json:"createdAt"`
	ModifiedAt null.Time   `json:"modifiedAt"`
	Date       time.Time   `json:"date"`
	Type       string      `json:"type"`
	Meal       Meal        `json:"meal"`
	Notes      null.String `json:"notes"`
}

func (mealdate *Mealdate) Insert() (*Mealdate, error) {
	tx, err := DB.Begin()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	stmt, err := tx.Prepare("INSERT INTO mealdates (date, type, notes, meal_id) VALUES (?, ?, ?)")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer stmt.Close()

	var meal *Meal
	if mealdate.Meal.ID == 0 {
		meal, _ = mealdate.Meal.Insert()
	} else {
		meal, _ = FindMealById(mealdate.Meal.ID)
	}

	result, err := stmt.Exec(mealdate.Date, mealdate.Type, mealdate.Notes, meal.ID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	Commit(tx)
	id, _ := result.LastInsertId()
	return FindMealdateById(id)
}

func (mealdate *Mealdate) Update() (*Mealdate, error) {
	tx, err := DB.Begin()
	if err != nil {
		return nil, err
	}

	stmt, err := tx.Prepare("UPDATE mealdates SET date = ?, type = ?, notes = ?, meal_id = ? WHERE id = ?")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(mealdate.Date, mealdate.Type, mealdate.Notes, mealdate.Meal.ID, mealdate.ID)
	if err != nil {
		return nil, err
	}

	Commit(tx)
	return FindMealdateById(mealdate.ID)
}

func (mealdate *Mealdate) Delete() (bool, error) {
	tx, err := DB.Begin()
	if err != nil {
		return false, err
	}

	stmt, err := DB.Prepare("DELETE from mealdates where id = ?")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(mealdate.ID)
	if err != nil {
		return false, err
	}

	Commit(tx)
	return true, nil
}

func FindMealdateById(id int64) (*Mealdate, error) {
	stmt, err := DB.Prepare("SELECT md.id, md.created_at, md.modified_at, md.date, md.type, md.notes, m.ID, m.created_at, m.modified_at, m.name, m.link, m.notes FROM mealdates AS md JOIN meals AS m ON m.ID = md.meal_id WHERE md.id = ?")
	if err != nil {
		return nil, err
	}

	mealdate := Mealdate{}
	meal := Meal{}
	err = stmt.QueryRow(id).Scan(&mealdate.ID, &mealdate.CreatedAt, &mealdate.ModifiedAt, &mealdate.Date, &mealdate.Type, &mealdate.Notes, &meal.ID, &meal.CreatedAt, &meal.ModifiedAt, &meal.Name, &meal.Link, &meal.Notes)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	mealdate.Meal = meal
	return &mealdate, nil
}

func FindAllMealdates() ([]Mealdate, error) {
	result, err := DB.Query("SELECT md.id, md.created_at, md.modified_at, md.date, md.type, md.notes, m.ID, m.created_at, m.modified_at, m.name, m.link, m.notes FROM mealdates AS md JOIN meals AS m ON m.ID = md.meal_id")
	if err != nil {
		return nil, err
	}
	defer result.Close()

	mealdates := make([]Mealdate, 0)
	for result.Next() {
		mealdate := Mealdate{}
		meal := Meal{}
		err = result.Scan(&mealdate.ID, &mealdate.CreatedAt, &mealdate.ModifiedAt, &mealdate.Date, &mealdate.Type, &mealdate.Notes, &meal.ID, &meal.CreatedAt, &meal.ModifiedAt, &meal.Name, &meal.Link, &meal.Notes)
		if err != nil {
			return nil, err
		}
		mealdate.Meal = meal
		mealdates = append(mealdates, mealdate)
	}

	err = result.Err()
	if err != nil {
		return nil, err
	}
	return mealdates, err
}
