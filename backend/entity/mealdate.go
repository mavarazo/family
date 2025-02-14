package entity

import (
	"log"

	"gorm.io/gorm"
)

type Mealdate struct {
	gorm.Model
	Date   LocalDate `json:"date"`
	Type   string    `json:"type"`
	MealID uint
	Meal   Meal    `json:"meal"`
	Notes  *string `json:"notes"`
}

func (mealdate *Mealdate) Insert() (*Mealdate, error) {
	log.Println("add ", mealdate)

	result := DB.Create(&mealdate)
	if result.Error != nil {
		return nil, result.Error
	}
	return FindMealdateById(mealdate.ID)
}

func (mealdate *Mealdate) Update() (*Mealdate, error) {
	result := DB.Save(&mealdate)
	if result.Error != nil {
		return nil, result.Error
	}
	return FindMealdateById(mealdate.ID)
}

func (mealdate *Mealdate) Delete() (bool, error) {
	result := DB.Delete(&mealdate)
	if result.Error != nil {
		return false, result.Error
	}
	return true, nil
}

func FindMealdateById(id uint) (*Mealdate, error) {
	var mealdate Mealdate
	result := DB.Preload("Meal").Find(&mealdate, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &mealdate, nil
}

func FindAllMealdates() ([]Mealdate, error) {
	var mealdates []Mealdate
	result := DB.Preload("Meal").Order("date ASC").Find(&mealdates)
	if result.Error != nil {
		return nil, result.Error
	}
	return mealdates, nil
}
