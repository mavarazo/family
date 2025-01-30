package meal

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func MealRegister(router *gin.RouterGroup) {
	router.GET("/", GetMeals)
	router.POST("/", AddMeal)
	router.GET("/:id", GetMeal)
	router.PUT("/:id", ChangeMeal)
	router.DELETE("/:id", RemoveMeal)
}

func GetMeals(c *gin.Context) {
	meals, _ := FindAllMeals()
	c.IndentedJSON(http.StatusOK, meals)
}

func AddMeal(c *gin.Context) {
	var newMeal Meal
	if err := c.BindJSON(&newMeal); err != nil {
		return
	}

	meal, err := SaveMeal(newMeal)
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusCreated, meal)
}

func GetMeal(c *gin.Context) {
	id := c.Param("id")
	meal, err := FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, meal)
}

func ChangeMeal(c *gin.Context) {
	var changedMeal Meal
	if err := c.BindJSON(&changedMeal); err != nil {
		return
	}

	id := c.Param("id")
	meal, err := FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}

	updatedMeal, err := UpdateMeal(meal.ID, changedMeal)
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, updatedMeal)
}

func RemoveMeal(c *gin.Context) {
	id := c.Param("id")
	meal, err := FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}

	_, err = DeleteMeal(meal)
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "meal deleted"})
}
