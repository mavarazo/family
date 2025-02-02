package controller

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mavarazo/family/entity"
)

func MealRegister(router *gin.RouterGroup) {
	router.GET("/", GetMeals)
	router.POST("/", AddMeal)
	router.GET("/:id", GetMeal)
	router.PUT("/:id", ChangeMeal)
	router.DELETE("/:id", RemoveMeal)
}

func GetMeals(c *gin.Context) {
	meals, _ := entity.FindAllMeals()
	c.IndentedJSON(http.StatusOK, meals)
}

func AddMeal(c *gin.Context) {
	var newMeal entity.Meal
	if err := c.BindJSON(&newMeal); err != nil {
		log.Println(err)
		return
	}

	meal, err := newMeal.Insert()
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusCreated, meal)
}

func GetMeal(c *gin.Context) {
	id, err := ParamInt(c, "id")
	meal, err := entity.FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, meal)
}

func ChangeMeal(c *gin.Context) {
	id, _ := ParamInt(c, "id")
	meal, err := entity.FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}

	var changedMeal entity.Meal
	if err := c.BindJSON(&changedMeal); err != nil {
		return
	}
	changedMeal.ID = meal.ID
	meal, err = changedMeal.Update()
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, meal)
}

func RemoveMeal(c *gin.Context) {
	id, _ := ParamInt(c, "id")
	meal, err := entity.FindMealById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "meal not found"})
		return
	}

	_, err = meal.Delete()
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "meal deleted"})
}
