package entity

import (
	"gorm.io/gorm"
)

type Meal struct {
	gorm.Model
	Name  string  `json:"name"`
	Link  *string `json:"link"`
	Notes *string `json:"notes"`
}

func (meal *Meal) Insert() (*Meal, error) {
	result := DB.Create(&meal)
	if result.Error != nil {
		return nil, result.Error
	}
	return FindMealById(meal.ID)
}

func (meal *Meal) Update() (*Meal, error) {
	result := DB.Save(&meal)
	if result.Error != nil {
		return nil, result.Error
	}
	return FindMealById(meal.ID)
}

func (meal *Meal) Delete() (bool, error) {
	result := DB.Delete(&meal)
	if result.Error != nil {
		return false, result.Error
	}
	return true, nil
}

func FindMealById(id uint) (*Meal, error) {
	var meal Meal
	result := DB.Find(&meal, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &meal, nil
}

func FindAllMeals() ([]Meal, error) {
	var meals []Meal
	result := DB.Order("name ASC").Find(&meals)
	if result.Error != nil {
		return nil, result.Error
	}
	return meals, nil
}
