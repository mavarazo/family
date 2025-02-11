package controller

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mavarazo/family/entity"
)

func MealdateRegister(router *gin.RouterGroup) {
	router.GET("/", GetMealdates)
	router.POST("/", AddMealdate)
	router.GET("/:id", GetMealdate)
	router.PUT("/:id", ChangeMealdate)
	router.DELETE("/:id", RemoveMealdate)
}

func GetMealdates(c *gin.Context) {
	mealdates, _ := entity.FindAllMealdates()
	c.IndentedJSON(http.StatusOK, mealdates)
}

func AddMealdate(c *gin.Context) {
	var newMealdate entity.Mealdate
	if err := c.BindJSON(&newMealdate); err != nil {
		log.Println(err)
		return
	}

	mealdate, err := newMealdate.Insert()
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusCreated, mealdate)
}

func GetMealdate(c *gin.Context) {
	id, _ := ParamInt(c, "id")
	mealdate, err := entity.FindMealdateById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "mealdate not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, mealdate)
}

func ChangeMealdate(c *gin.Context) {
	id, _ := ParamInt(c, "id")
	mealdate, err := entity.FindMealdateById(id)
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "mealdate not found"})
		return
	}

	var changedMealdate entity.Mealdate
	if err := c.BindJSON(&changedMealdate); err != nil {
		return
	}
	changedMealdate.ID = mealdate.ID
	mealdate, err = changedMealdate.Update()
	if err != nil {
		log.Println(err)
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, mealdate)
}

func RemoveMealdate(c *gin.Context) {
	id, _ := ParamInt(c, "id")
	mealdate, err := entity.FindMealdateById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "mealdate not found"})
		return
	}

	_, err = mealdate.Delete()
	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, gin.H{"message": "something went wrong"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "mealdate deleted"})
}
