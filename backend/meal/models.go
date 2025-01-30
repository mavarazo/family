package meal

import (
	"github.com/mavarazo/family/common"
	"gorm.io/gorm"
)

type Meal struct {
	gorm.Model
	Name        string
	Link        string
	Description string `gorm:"size:2048"`
}

func FindAllMeals() ([]Meal, error) {
	db := common.GetDatabase()
	var meals []Meal
	result := db.Find(&meals)
	return meals, result.Error
}

func FindMealById(id string) (Meal, error) {
	db := common.GetDatabase()
	var meal Meal
	result := db.First(&meal, id)
	return meal, result.Error
}

func SaveMeal(meal Meal) (Meal, error) {
	db := common.GetDatabase()
	result := db.Save(&meal)
	if result.Error != nil {
		return Meal{}, result.Error
	}
	result = db.First(&meal, meal.ID)
	return meal, result.Error
}

func UpdateMeal(id uint, meal Meal) (Meal, error) {
	db := common.GetDatabase()
	var existingMeal Meal
	result := db.First(&existingMeal, id)
	if result.Error != nil {
		return Meal{}, result.Error
	}

	existingMeal.Name = meal.Name
	existingMeal.Link = meal.Link
	existingMeal.Description = meal.Description

	result = db.Save(&existingMeal)
	return existingMeal, result.Error
}

func DeleteMeal(meal Meal) (int64, error) {
	db := common.GetDatabase()
	result := db.Delete(&meal)
	return result.RowsAffected, result.Error
}
